const User = require('../mongodb/model/userSchema');
const UserFollowFollowing = require('../mongodb/model/userFollowSchema');
const Group = require('../mongodb/model/chatRoomSchema');
const mongoose = require('mongoose');

exports.isUserAuthenticated = async (req, res, next) => {
    try {
        const user = req.isAuthenticated();
        if (!user) throw new Error('User Not Authenticated');
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Authentication',
            message: 'User Not Authenticated'
        })
    }
}

const createUser = async (userId) => {
    const createdUser = await UserFollowFollowing.create({ userid: userId });
    if (!createdUser) throw new Error('Error while creating user');
    return createdUser;
}

exports.checkIsUserExistsOrCreate = async (req, res, next) => {
    const { loggedUserId, followerId } = req.query;
    try {
        const isLoggedUserExists = await UserFollowFollowing.findOne({ userid: loggedUserId });
        if (!isLoggedUserExists) {
            await createUser(loggedUserId);
        }
        const isFollowerUserIdExists = await UserFollowFollowing.findOne({ userid: followerId });
        if (!isFollowerUserIdExists) {
            await createUser(followerId);
        }
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}

exports.checkIsUserExists = async (req, res, next) => {
    const { userID } = req.query;
    try {
        const user = await User.findOne({ _id: userID });
        if (!user) throw new Error('User does not exist');
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}

exports.authenticateUser = async (req, res) => {
    try {
        const isUserAuthenticated = req.isAuthenticated();
        if (!isUserAuthenticated) {
            res.status(200).json({
                status: 'Success',
                data: {
                    userInfo: {},
                    isUserLoggedIn: false
                }
            })
            return;
        }
        const userInfo = req.user;
        const loggedUserFollowingList = await UserFollowFollowing.findOne({ userid: userInfo._id }, { following: 1 });
        res.status(200).json({
            status: 'Success',
            data: {
                userInfo,
                followingList: loggedUserFollowingList?.following ?? [],
                isUserLoggedIn: true
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Falied',
            message: err.message
        })
    }
}


exports.logoutUser = async (req, res) => {
    try {
        req.logout();
        res.clearCookie('funChatSession');
        res.status(200).json({
            status: 'Success',
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}

exports.getUserById = async (req, res) => {
    const { userID } = req.query
    try {
        const userInfoById = await User.findOne({ _id: userID });
        if (!userInfoById) throw new Error('Error while getting userInfo');
        res.status(200).json({
            status: 'Success',
            data: {
                userInfo: userInfoById
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
};


exports.getUserPanelCount = async (req, res) => {
    const { userID } = req.query;
    try {
        const followFollowingInfo = await UserFollowFollowing.findOne({ userid: userID });
        const groupInfo = await Group.find(
            {
                users: {
                    $in: [
                        userID
                    ]
                }
            }
        );
        res.status(200).json({
            status: 'Success',
            data: {
                followerCount: followFollowingInfo ? followFollowingInfo.follower.length : 0,
                followingCount: followFollowingInfo ? followFollowingInfo.following.length : 0,
                groupCount: groupInfo ? groupInfo.length : 0
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}


exports.getuserFollowFollowingList = async (req, res) => {
    const { userID, type } = req.query;
    const validTypeQuery = ['follower', 'following'];
    try {
        if (!validTypeQuery.includes(type.toLowerCase())) throw new Error('Invalid query');
        const userList = type.toLowerCase() === 'follower' ? await UserFollowFollowing.findOne({ userid: userID }, { userid: 1, follower: 2 }).populate('follower')
            : await UserFollowFollowing.findOne({ userid: userID }, { userid: 1, following: 2 }).populate('following');
        if (!userList) throw new Error('Error while getting the userList list');
        res.status(200).json({
            status: 'Success',
            data: {
                userList: {
                    userData: type.toLowerCase() === 'follower' ? userList.follower : userList.following,
                    userId: userList.userid
                }
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
};

const followUser = async (input) => {
    const { visitorUserId, loggedUserId, followerId } = input;
    try {
        const loggedUserUpdated = await UserFollowFollowing.findOneAndUpdate(
            {
                userid: loggedUserId
            },
            {
                $addToSet: {
                    following: mongoose.Types.ObjectId(followerId)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!loggedUserUpdated) throw new Error('Error while follow the user');
        const followerUserUpdate = await UserFollowFollowing.findOneAndUpdate(
            {
                userid: followerId
            },
            {
                $addToSet: {
                    follower: mongoose.Types.ObjectId(loggedUserId)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!followerUserUpdate) throw new Error('Error while follow the user');
        const userList = await UserFollowFollowing.findOne({ userid: visitorUserId }).populate('follower').populate('following');
        if (!userList) throw new Error('Error while getting visitor user id');
        return userList;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

const unFollowUser = async (input) => {
    const { visitorUserId, loggedUserId, followerId } = input;
    try {
        const loggedUserUpdated = await UserFollowFollowing.findOneAndUpdate(
            {
                userid: loggedUserId
            },
            {
                $pull: {
                    following: mongoose.Types.ObjectId(followerId)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!loggedUserUpdated) throw new Error('Error while follow the user');
        const followerUserUpdate = await UserFollowFollowing.findOneAndUpdate(
            {
                userid: followerId
            },
            {
                $pull: {
                    follower: mongoose.Types.ObjectId(loggedUserId)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!followerUserUpdate) throw new Error('Error while follow the user');
        const userList = await UserFollowFollowing.findOne({ userid: visitorUserId }).populate('follower').populate('following');
        if (!userList) throw new Error('Error while getting visitor user id');
        return userList;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

exports.updateFollowFollowing = async (req, res) => {
    const { visitorUserId, loggedUserId, followerId, type, visitorPageType } = req.query;
    const validTypeQuery = ['follow', 'unfollow'];
    try {
        if (!validTypeQuery.includes(type.toLowerCase())) throw new Error('Invalid Query');
        const userList = type === 'follow' ? await followUser({ visitorUserId, loggedUserId, followerId }) : await unFollowUser({ visitorUserId, loggedUserId, followerId });
        const loggedUserFollowingList = await UserFollowFollowing.findOne({ userid: loggedUserId }, { following: 1 });
        res.status(200).json({
            status: 'Success',
            data: {
                userList: visitorPageType === 'follower' ? userList.follower : userList.following,
                userFollowingCount: userList.following.length,
                userFollowerCount: userList.follower.length,
                loggedUserFollowingList: loggedUserFollowingList.following
            }
        })

    }
    catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err.message
        })
    }
};


exports.editProfile = async (req, res) => {
    const { userID } = req.query;
    try {
        const updatedProfile = await User.findOneAndUpdate(
            {
                _id: userID
            },
            {
                username: req.body.username,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedProfile) throw new Error('Error while updating user data');
        res.status(200).json({
            status: 'Success',
            data: {
                userInfo: updatedProfile
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}


