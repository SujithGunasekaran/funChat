const router = require('express').Router();
const roomController = require('../controller/roomController');

router.post('/createRoom', roomController.checkIsUserAuthenticated, roomController.checkIsRoomNameExists, roomController.createRoom);
router.get('/getByRoomId', roomController.checkIsUserAuthenticated, roomController.getRoomInfoById);
router.get('/getByRoomType', roomController.getRoomInfoByType);
router.post('/joinRoom', roomController.checkIsUserAuthenticated, roomController.joinRoom);
router.get('/getRoomUser', roomController.checkIsUserAuthenticated, roomController.getRoomUser)

module.exports = router;
