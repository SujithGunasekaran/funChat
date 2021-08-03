const router = require('express').Router();
const userController = require('../controller/userController');

router.route('/').get(userController.authenticateUser);
router.route('/logout').get(userController.logoutUser);
router.route('/userID').get(userController.isUserAuthenticated, userController.getUserById);
router.route('/followFollowing')
    .get(userController.isUserAuthenticated, userController.getuserFollowFollowingList)
    .post(userController.isUserAuthenticated, userController.checkIsUserExistsOrCreate, userController.updateFollowFollowing);
router.route('/getUserPanelCount').get(userController.isUserAuthenticated, userController.getUserPanelCount);
router.route('/updateProfile').patch(userController.isUserAuthenticated, userController.checkIsUserExists, userController.editProfile);

module.exports = router;
