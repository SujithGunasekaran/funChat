const route = require('express').Router();
const userController = require('../controller/userController');

route.get('/', userController.authenticateUser);
route.get('/logout', userController.logoutUser);
route.get('/userID', userController.isUserAuthenticated, userController.getUserById)


module.exports = route;
