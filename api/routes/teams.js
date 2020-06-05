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
router.get('/:teamID', TeamsController.get_team_by_id);

/**
 * Update a game
 */
router.patch('/:teamID', checkAuth, TeamsController.update_team);

/**
 * Delete a game
 */
router.delete('/:teamID', checkAuth, TeamsController.delete_team);


module.exports = router;