const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/verifyAuthenticationToken.js');
const GamesController = require('../controllers/gamesController');

/**
 * Get all games
 */
router.get('/', GamesController.get_all_games);

/**
 * Create a game
 */
router.post('/', checkAuth, GamesController.create_new_game);

/**
 * Retrieve a game
 */
router.get('/:gameID', GamesController.get_game_by_id);

/**
 * Update a game
 */
router.patch('/:gameID', checkAuth, GamesController.update_game);

/**
 * Update a game
 */
router.patch('/join-game/:gameID', checkAuth, GamesController.join_game);

/**
 * Delete a game
 */
router.delete('/:gameID', checkAuth, GamesController.delete_game);


module.exports = router;