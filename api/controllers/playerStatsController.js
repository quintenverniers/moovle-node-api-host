const mongoose = require('mongoose');

const PlayerStats = require('../models/playerStats');

exports.get_all_playerStats = (req, res, next) => {
    PlayerStats.find()
    .exec()
    .then((playerstats) => {
        res.status(200).json({
            count: playerstats.length,
            teamstats: playerstats
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
}

exports.create_playerStats = (req, res, next) => {
    const playerStats = new PlayerStats({
        _id: new mongoose.Types.ObjectId(),
    });
    playerStats.save()
    .then(result => {
        res.status(201).json({
            message: 'Handling POST request to /playerstats',
            createdPlayerstats: result
        }); 
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
    
}

exports.get_playerStat_by_id = (req, res, next) => {
    const id = req.params.playerStatID;
    PlayerStats.findById(id)
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

exports.update_playerStat = (req, res, next) => {
    const id = req.params.playerStatID;
    const fieldsToUpdate = {};
    for(const field of req.body) {
        fieldsToUpdate[field.propName] = field.value
    }

    PlayerStats.update({ _id: id },{ $set: fieldsToUpdate })
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

exports.delete_playerStat = (req, res, next) => {
    const id = req.params.playerStatID;
    PlayerStats.remove({ _id: id })
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