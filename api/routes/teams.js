const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Team = require('../models/team');

/**
 * Get all games
 */
router.get('/', (req, res, next) => {
    Team.find()
    .exec()
    .then((teams) => {
        res.status(200).json(teams);
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

/**
 * Create a game
 */
router.post('/', (req, res, next) => {
    const team = new Team({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        owner: req.body.owner
    });
    team.save().then(result => {
        res.status(200).json({
            message: 'Handling POST request to /teams',
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
router.get('/:teamID', (req, res, next) => {
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
});

/**
 * Update a game
 */
router.patch('/:teamID', (req, res, next) => {
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
});

/**
 * Delete a game
 */
router.delete('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    Team.remove({ _id: id })
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