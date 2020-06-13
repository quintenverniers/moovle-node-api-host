const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/verifyAuthenticationToken.js');
const GamesController = require('../controllers/gamesController');

/**
 * Get all games
 */
router.get('/', GamesController.get_all_games);

/**
 * Get all upcoming games
 */
router.get('/upcoming', GamesController.get_all_upcoming_games);

/**
 * Get games hosted by loggedIn user
 */
router.get('/userhosted_games', checkAuth, GamesController.get_games_by_host);

/**
 * Search for games
 */
router.get('/search/', GamesController.search_games);

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
 * Join a game
 */
router.patch('/join-game/:gameID', checkAuth, GamesController.join_game);

/**
 * Leave a game
 */
router.patch('/leave-game/:gameID', checkAuth, GamesController.leave_game);

/**
 * Delete a game
 */
router.delete('/:gameID', checkAuth, GamesController.delete_game);


module.exports = router;