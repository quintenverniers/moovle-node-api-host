const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/verifyAuthenticationToken.js');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, new Date().getTime() +'_'+file.originalname);
    }
});

const filterFilesToBeAccepted = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //accept file
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter: filterFilesToBeAccepted});

const Team = require('../models/team');
const TeamStats = require('../models/teamStats');

/**
 * Get all games
 */
router.get('/', (req, res, next) => {
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
});

/**
 * Create a game
 */
router.post('/', checkAuth, upload.single('teamImage'), (req, res, next) => {
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
    
});


module.exports = router;