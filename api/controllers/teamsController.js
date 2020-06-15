const mongoose = require('mongoose');

const Team = require('../models/team');
const User = require('../models/user');

/**
 * Get all teams
 */
exports.get_all_teams = (req, res, next) => {
	Team.find()
		.populate('owner')
		.populate('members', '_id firstname lastname email')
		.exec()
		.then((teams) => {
			res.status(200).json({
				count: teams.length,
				teams: teams
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

/**
 * Get all playerstats of a team (rankings)
 */
exports.get_all_team_playerstats = (req, res, next) => {
	const id = req.params.teamID;
	Team.findById(id, {_id: 1, name: 1, members: 1})
		.populate('members', '_id firstname lastname experience')
		.exec()
		.then((doc) => {
			console.log(doc);
			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({
					message: 'no team found with the provided ID'
				})
			}

		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

/**
 * Get all teams by owner 
 */
exports.get_teams_from_owner = (req, res, next) => {
	let user = req.userData.userID;
	Team.find({ owner: user })
		.populate('owner')
		.populate('members', '_id firstname lastname email')
		.exec()
		.then((teams) => {
			res.status(200).json({
				count: teams.length,
				teams: teams,
				newAuthToken: req.userData.newToken
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

/**
 * Get all teams the loggedIn user is in
 */
exports.get_teams_user_is_in = (req, res, next) => {
	let user = req.userData.userID;
	Team.find({ members: user })
		.populate('owner')
		.populate('members', '_id firstname lastname email')
		.exec()
		.then((teams) => {
			res.status(200).json({
				count: teams.length,
				teams: teams,
				newAuthToken: req.userData.newToken
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

/**
 * Create a team
 */
exports.create_new_team = (req, res, next) => {
	//updating user
	const createTeamXP = 200;
	let userID = req.userData.userID;
	User.find({ _id: req.userData.userID })
	.exec()
	.then((user) => {
		let currentXP = user[0].experience;
		let newUserXP = currentXP + createTeamXP;
		return User.updateOne({ _id: userID }, { $set: { experience: newUserXP } }).exec();
	})
	.then(updatedUser => {
		//console.log(updatedUser);
	})
	.catch(error => {
		console.log(error);
	});

	//creating game
	let file = (req.file) ? req.file.path : null;
	let user = req.userData.userID;
	let members = [];
	members.push(user);
	const team = new Team({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		owner: user,
		teamImage: file,
		members: members
	});

	team.save().then(result => {
		res.status(201).json({
			message: 'Handling POST request to /teams',
			createdTeam: result,
			user: req.userData,
			newAuthToken: req.userData.newToken
		});
	}).catch(err => {
		res.status(500).json({
			error: err
		});
	})
}

/**
 * Get a team
 */
exports.get_team_by_id = (req, res, next) => {
	const id = req.params.teamID;
	Team.findById(id)
		.populate('owner')
		.populate('members','_id firstname lastname')
		.exec()
		.then((doc) => {
			console.log(doc);
			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({
					message: 'no team found with the provided ID'
				})
			}

		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

/**
 * Update a team
 */
exports.update_team = (req, res, next) => {
	const id = req.params.teamID;
	const fieldsToUpdate = {};
	for (const field of req.body) {
		fieldsToUpdate[field.propName] = field.value
	}

	Team.update({ _id: id }, { $set: fieldsToUpdate })
		.exec()
		.then((result) => {
			res.status(200).json({
				result,
				newAuthToken: req.userData.newToken
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
}

/**
 * Join a team
 */
exports.join_team = (req, res, next) => {
	//updating user
	const joinTeamXP = 100;
	let userID = req.userData.userID;
	User.find({ _id: req.userData.userID })
	.exec()
	.then((user) => {
		let currentXP = user[0].experience;
		let newUserXP = currentXP + joinTeamXP;
		return User.updateOne({ _id: userID }, { $set: { experience: newUserXP } }).exec();
	})
	.then(updatedUser => {
		//console.log(updatedUser);
	})
	.catch(error => {
		console.log(error);
	});

	const id = req.params.teamID;
	const userToJoinTeam = req.userData.userID;
	let currentMembers = [];
	Team.findById(id)
		.exec()
		.then((team) => {
			currentMembers = team.members;
			currentMembers.push(userToJoinTeam);
			return Team.updateOne(
				{ _id: id },
				{
					$set: {
						members: currentMembers
					}
				}).exec();
		})
		.then((teamResult) => {
			res.status(200).json({
				teamResult,
				currentMembers: currentMembers,
				newUser: userToJoinTeam,
				newAuthToken: req.userData.newToken
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		});
}

/**
 * Leave a team
 */
exports.leave_team = (req, res, next) => {
	const id = req.params.teamID;
	const userToLeaveTeam = req.body.user;
	let currentMembers = [];
	Team.findById(id)
		.exec()
		.then((team) => {
			currentMembers = team.members;

			console.log(currentMembers);

			let index = currentMembers.indexOf(userToLeaveTeam);
			if (index > -1) {
				currentMembers.splice(index, 1);
			}

			console.log(currentMembers);


			return Team.updateOne(
				{ _id: id },
				{
					$set: {
						members: currentMembers
					}
				}).exec();
		})
		.then((teamResult) => {
			res.status(200).json({
				members: currentMembers,
				newUser: userToLeaveTeam,
				newAuthToken: req.userData.newToken
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
}

/**
 * Delete a team
 */
exports.delete_team = (req, res, next) => {
	const id = req.params.teamID;
	Team.findById(id)
		.exec()
		.then((doc) => {
			if (doc) {
				return Team.deleteOne({ _id: id }).exec()
			}
		})
		.then((teamresult => {
			res.status(200).json({
				teamresult,
				newAuthToken: req.userData.newToken
			});
		}))
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: 'team was not removed',
				error: err
			});
		});

}