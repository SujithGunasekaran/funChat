const route = require('express').Router();
const userController = require('../controller/userController');

route.get('/', userController.authenticateUser);



module.exports = route;
