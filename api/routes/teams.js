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

const TeamsController = require('../controllers/teamsController');

/**
 * Get all teams
 */
router.get('/', TeamsController.get_all_teams);

/**
 * Get playerstats from specific team
 */
router.get('/stats/:teamID', TeamsController.get_all_team_playerstats);

/**
 * Get teams owned by current user
 */
router.get('/teams_by_owner', checkAuth, TeamsController.get_teams_from_owner);

/**
 * Get teams where current user is a member of
 */
router.get('/teams_user_is_in', checkAuth, TeamsController.get_teams_user_is_in);

/**
 * Create a team
 */
router.post('/', checkAuth, upload.single('teamImage'), TeamsController.create_new_team);

/**
 * Retrieve a team
 */
router.get('/:teamID', TeamsController.get_team_by_id);

/**
 * Update a team
 */
router.patch('/:teamID', checkAuth, TeamsController.update_team);

/**
 * Join a team
 */
router.patch('/join/:teamID', checkAuth, TeamsController.join_team);

/**
 * Leave a team
 */
router.patch('/leave/:teamID', checkAuth, TeamsController.leave_team);

/**
 * Delete a team
 */
router.delete('/:teamID', checkAuth, TeamsController.delete_team);


module.exports = router;