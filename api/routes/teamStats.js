const express = require('express');
const router = express.Router();

const TeamStatsController = require('../controllers/teamStatsController');

/**
 * Get all teamstats
 */
router.get('/', TeamStatsController.get_all_teamStats);

/**
 * Create a teamstat
 */
router.post('/', TeamStatsController.create_teamStats);

/**
 * Retrieve a game
 */
router.get('/:teamStatID', TeamStatsController.get_teamStat_by_id);

/**
 * Update a teamstat
 */
router.patch('/:teamStatID', TeamStatsController.update_teamStat);

/**
 * Delete a game
 */
router.delete('/:teamstatsID', TeamStatsController.delete_teamStat);


module.exports = router;