const router = require('express').Router();
const groupController = require('../controller/groupController');

router.post('/createGroup', groupController.checkIsUserAuthenticated, groupController.checkIsGroupNameExists, groupController.createGroup);
router.get('/getByGroupId', groupController.checkIsUserAuthenticated, groupController.getGroupInfoById);
router.get('/getByGroupType', groupController.getGroupInfoByType);
router.post('/joinGroup', groupController.checkIsUserAuthenticated, groupController.joinGroup);
router.get('/getGroupUser', groupController.checkIsUserAuthenticated, groupController.getGroupUser)

module.exports = router;
