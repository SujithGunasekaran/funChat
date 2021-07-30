const router = require('express').Router();
const groupController = require('../controller/groupController');

router.post('/createGroup', groupController.checkIsUserAuthenticated, groupController.checkIsGroupNameExists, groupController.createGroup);
router.get('/getByGroupId', groupController.checkIsUserAuthenticated, groupController.getGroupInfoById);
router.get('/getByGroupType', groupController.checkIsUserAuthenticated, groupController.getGroupInfoByType);
router.post('/joinGroup', groupController.checkIsUserAuthenticated, groupController.joinGroup);
router.get('/getGroupUser', groupController.checkIsUserAuthenticated, groupController.getGroupUser);
router.post('/leaveGroup', groupController.checkIsUserAuthenticated, groupController.leaveGroup);
router.post('/setOfflineUser', groupController.checkIsUserAuthenticated, groupController.checkIsGroupNameExists, groupController.setOfflineUser)
router.get('/userGroups', groupController.checkIsUserAuthenticated, groupController.getUserGroups);

module.exports = router;
