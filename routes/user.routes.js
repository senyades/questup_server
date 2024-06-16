const Router = require('express')
const router = new Router()
const UserController = require('../controller/user.controller')
const jwt = require('jsonwebtoken');
const TokenService = require('../services/token');

router.post('/create_user', UserController.createUser)

router.post('/login_user', UserController.loginUser)
router.delete('/user/:login', UserController.deleteUser)
router.post("/refresh", UserController.refresh);
router.post("/logout", UserController.logOut);


router.get('/get_leaderboard', UserController.getLeaderboard)

module.exports = router