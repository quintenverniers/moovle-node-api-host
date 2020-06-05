const mongoose = require('mongoose');

const Team = require('../models/team');
const TeamStats = require('../models/teamStats');

exports.get_all_teams = (req, res, next) => {
    Team.find()
    .populate('teamstats')
    .exec()
    .then((teams) => {
        res.status(200).json({
            count: teams.length,
            teams: teams
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
};

exports.create_new_team = (req, res, next) => {
    const teamStats = new TeamStats({
        _id: new mongoose.Types.ObjectId(),
    });
    teamStats.save()
    .then(teamStats => {
        const team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            owner: req.body.owner,
            teamstats: teamStats._id,
            teamImage: req.file.path
        });
        team.save().then(result => {
            res.status(200).json({
                message: 'Handling POST request to /teams',
                createdTeam: result,
                user: req.userData
            }); 
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    })
}