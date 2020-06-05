const mongoose = require('mongoose');

const TeamStats = require('../models/teamStats');

/**
 * Get all teamstats
 */
exports.get_all_teamStats = (req, res, next) => {
    TeamStats.find()
    .exec()
    .then((teamstats) => {
        res.status(200).json({
            count: teamstats.length,
            teamstats: teamstats
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
}

/**
 * Create a teamstat
 */
exports.create_teamStats = (req, res, next) => {
    const teamStats = new TeamStats({
        _id: new mongoose.Types.ObjectId(),
    });
    teamStats.save()
    .then(result => {
        res.status(201).json({
            message: 'Handling POST request to /teamsstats',
            createdTeamstats: result
        }); 
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
    
}

/**
 * Get a teamstat
 */
exports.get_teamStat_by_id = (req, res, next) => {
    const id = req.params.teamStatID;
    TeamStats.findById(id)
    .exec()
    .then((doc) => {
        console.log(doc);
        if(doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'no teamstats found with the provided ID'
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
 * Update a teamstat
 */
exports.update_teamStat = (req, res, next) => {
    const id = req.params.teamStatID;
    const fieldsToUpdate = {};
    for(const field of req.body) {
        fieldsToUpdate[field.propName] = field.value
    }

    TeamStats.update({ _id: id },{ $set: fieldsToUpdate })
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

/**
 * Delete a teamstat
 */
exports.delete_teamStat = (req, res, next) => {
    const id = req.params.teamstatsID;
    TeamStats.remove({ _id: id })
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