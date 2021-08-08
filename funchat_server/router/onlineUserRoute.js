const router = require('express').Router();
const onlineUserController = require('../controller/onlineUserController');

router.route('/')
    .get(onlineUserController.checkIsUserAuthenticated, onlineUserController.getOnlineUser)
    .post(onlineUserController.checkIsUserAuthenticated, onlineUserController.setOnlineUser)
    .delete(onlineUserController.deleteOnlineUser);

module.exports = router;
