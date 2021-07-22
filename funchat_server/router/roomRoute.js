const router = require('express').Router();
const roomController = require('../controller/roomController');

router.post('/createRoom', roomController.checkIsUserAuthenticated, roomController.checkIsRoomNameExists, roomController.createRoom);
router.get('/', roomController.checkIsUserAuthenticated, roomController.getRoomInfoById);

module.exports = router;
