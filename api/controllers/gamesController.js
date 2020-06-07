const mongoose = require('mongoose');
const Game = require('../models/game');


/**
 * Get all games
 */
exports.get_all_games = (req, res, next) => {
    Game.find()
    .populate('host','_id firstname lastname')
    .exec()
    .then((games) => {
        console.log(games);
        res.status(200).json({
            count: games.length,
            games: games
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

/**
 * Create a game
 */
exports.create_new_game = (req, res, next) => {
    console.log(req.userData.userID);
    let createdDate = new Date().getTime();
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        teamSize: req.body.teamSize,
        spotsLeft: req.body.spotsLeft,
        totalSpots: req.body.teamSize * 2,
        date: req.body.date,
        startTime: req.body.startTime,
        duration: req.body.duration,
        location: req.body.location,
        pitchType: req.body.pitchType,
        venueType: req.body.venueType,
        payingGame: req.body.payingGame,
        entryPrice: req.body.entryPrice,
        host: req.userData.userID,
        createdAt: createdDate,
        updatedAt: createdDate
    });
    game.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST request to /games',
            createdGame: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

/**
 * Get game by id
 */
exports.get_game_by_id = (req, res, next) => {
    const id = req.params.gameID;
    Game.findById(id)
    .exec()
    .then((doc) => {
        console.log(doc);
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'no game found with the provided ID'
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
 * Update a game
 */
exports.update_game = (req, res, next) => {
    let updateDate = new Date();
    const id = req.params.gameID;
    const fieldsToUpdate = {};
    for(const field of req.body) {
        fieldsToUpdate[field.propName] = field.value
    }
    fieldsToUpdate['updatedAt'] = updateDate;

    Game.update({ _id: id },{ $set: fieldsToUpdate })
    .exec()
    .then((updatedGame) => {
        console.log(updatedGame);
        res.status(200).json({
            updatedGame
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

/**
 * Join a game
 */
exports.join_game = (req, res, next) => {
    const id = req.params.gameID;
    const userToJoinGame = req.userData.userID;
    let currentParticipants = [];

    Game.findById(id)
    .exec()
    .then((game) => {
        
        currentParticipants = game.participants;
        spotsLeft = game.spotsLeft;

        if(currentParticipants.indexOf(userToJoinGame) === -1 && currentParticipants.length < game.totalSpots) {
            currentParticipants.push(userToJoinGame);
            spotsLeft -= 1;
        }
        
        return Game.updateOne(
            { _id: id },
            { $set: {
                participants: currentParticipants,
                spotsLeft: spotsLeft,
            }
        }).exec();
    })
    .then((gameResult) => {
        res.status(200).json({
            currentParticipants: currentParticipants,
            newUser: userToJoinGame
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

/**
 * Leave a game
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
        if(index > -1) {
            currentMembers.splice(index,1);
        }

        console.log(currentMembers);
        

        return Team.updateOne(
            { _id: id },
            { $set: {
                members: currentMembers
            }
        }).exec();
    })
    .then((teamResult) => {
        res.status(200).json({
            members: currentMembers,
            newUser: userToLeaveTeam
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
 * Delete a game
 */
exports.delete_game = (req, res, next) => {
    const id = req.params.gameID;
    Game.deleteOne({ _id: id })
    .exec()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}