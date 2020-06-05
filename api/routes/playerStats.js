const express = require('express');
const router = express.Router();

const PlayerStatsController = require('../controllers/playerStatsController');

/**
 * Get all playerstats
 */
router.get('/', PlayerStatsController.get_all_playerStats);

/**
 * Create a playerstat
 */
router.post('/', PlayerStatsController.create_playerStats);

/**
 * Retrieve a playerstat
 */
router.get('/:playerStatID', PlayerStatsController.get_playerStat_by_id);

/**
 * Update a playerstat
 */
router.patch('/:playerStatID', PlayerStatsController.update_playerStat);

/**
 * Delete a playerstat
 */
router.delete('/:playerStatID', PlayerStatsController.delete_playerStat);


module.exports = router;