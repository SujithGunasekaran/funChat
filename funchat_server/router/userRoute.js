const route = require('express').Router();
const userController = require('../controller/userController');

route.get('/', userController.authenticateUser);
route.get('/logout', userController.logoutUser)


module.exports = route;
