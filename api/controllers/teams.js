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
            res.status(201).json({
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

exports.get_team_by_id = (req, res, next) => {
    const id = req.params.teamID;
    Team.findById(id)
    .exec()
    .then((doc) => {
        console.log(doc);
        if(doc) {
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

exports.update_team = (req, res, next) => {
    const id = req.params.teamID;
    const fieldsToUpdate = {};
    for(const field of req.body) {
        fieldsToUpdate[field.propName] = field.value
    }

    Team.update({ _id: id },{ $set: fieldsToUpdate })
    .exec()
    .then((result) => {
        res.status(200).json({ result });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.delete_team = (req, res, next) => {
    const id = req.params.teamID;
    Team.findById(id)
    .exec()
    .then((doc) => {
        if(doc) {
            return TeamStats.deleteOne({_id: doc.teamstats}).exec()
        }
    })
    .then(() => {
        return Team.deleteOne({_id: id}).exec()
    })
    .then((teamresult => {
        res.status(200).json(teamresult);
    }))
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'team was not removed',
            error: err
        });
    });
    
}