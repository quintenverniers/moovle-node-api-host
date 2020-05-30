const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const TeamStats = require('../models/teamStats');

/**
 * Get all games
 */
router.get('/', (req, res, next) => {
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
});

/**
 * Create a game
 */
router.post('/', (req, res, next) => {
    const teamStats = new TeamStats({
        _id: new mongoose.Types.ObjectId(),
        team: req.body.team,
    });
    teamStats.save()
    .then(result => {
        res.status(200).json({
            message: 'Handling POST request to /teamsstats',
            createdTeam: result
        }); 
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

/**
 * Retrieve a game
 */
router.get('/:teamStatID', (req, res, next) => {
    const id = req.params.teamStatID;
    TeamStats.findById(id)
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
});

/**
 * Update a game
 */
router.patch('/:teamStatID', (req, res, next) => {
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
});

/**
 * Delete a game
 */
router.delete('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
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
});


module.exports = router;