const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/verifyAuthenticationToken.js');

const UsersController = require('../controllers/usersController');

/**
 * Get all users
 */
router.get("/", UsersController.get_all_users);

/**
 * Get a user
 */
router.get("/:UserID", UsersController.get_user_by_id);

/**
 * Create a game
 */
router.post("/signup", UsersController.register_user);

/**
 * Login a user
 */
router.post("/login", UsersController.user_login);

/**
 * Delete a user
 */
router.delete('/:userID', checkAuth, UsersController.delete_user);

/**
 * Update a user
 */
router.patch('/', checkAuth, UsersController.update_user);

module.exports = router;