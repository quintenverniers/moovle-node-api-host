const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/verifyAuthenticationToken.js');

const UsersController = require('../controllers/usersController');

router.get("/", UsersController.get_all_users);

router.get("/:UserID", UsersController.get_user_by_id);

router.post("/signup", UsersController.register_user);

router.post("/login", UsersController.user_login);

router.delete('/:userID', checkAuth, UsersController.delete_user);

router.patch('/:userID', checkAuth, UsersController.update_user);

module.exports = router;