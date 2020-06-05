const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/verifyAuthenticationToken.js');

const multer = require('multer');

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

const TeamsController = require('../controllers/teams');

/**
 * Get all games
 */
router.get('/', TeamsController.get_all_teams);

/**
 * Create a game
 */
router.post('/', checkAuth, upload.single('teamImage'), TeamsController.create_new_team);

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