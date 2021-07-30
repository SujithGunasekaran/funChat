const Room = require('../mongodb/model/chatRoomSchema');
const mongoose = require('mongoose');

exports.checkIsUserAuthenticated = (req, res, next) => {
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

exports.checkIsGroupNameExists = async (req, res, next) => {
    const { groupname } = req.body;
    try {
        const isGroupNameExists = await Room.findOne({ groupname });
        if (isGroupNameExists) throw new Error('Room name already taken');
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: 'Room name already taken'
        })
    }
}


exports.createGroup = async (req, res) => {
    try {
        const createdGroupInfo = await Room.create({ ...req.body, groupadmin: req.body.users });
        if (!createdGroupInfo) throw new Error('Error while creating room');
        const groupInfo = await Room.findOne({ _id: createdGroupInfo._id }).populate('users');
        res.status(200).json({
            status: 'Success',
            data: {
                groupInfo
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: 'Error while creating room'
        })
    }
}

exports.joinGroup = async (req, res) => {
    const { groupID = '', userID = '', groupType = 'public' } = req.query;
    try {
        const joinedGroupInfo = await Room.findOneAndUpdate(
            {
                _id: groupID,
                grouptype: groupType
            },
            {
                $addToSet: {
                    users: mongoose.Types.ObjectId(userID)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        await Room.findOneAndUpdate(
            {
                _id: groupID
            },
            {
                $pull: {
                    offlineUser: mongoose.Types.ObjectId(userID)
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!joinedGroupInfo) throw new Error('Error while joining room');
        res.status(200).json({
            status: 'Success',
            data: {
                groupID: joinedGroupInfo._id
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: 'Error while joining Group, Please check group ID'
        })
    }
}


exports.getGroupInfoById = async (req, res) => {
    const { groupID = '', userID } = req.query;
    try {
        const groupInfo = await Room.findOne({ _id: groupID }).populate('users');
        if (!groupInfo) throw new Error('Error while getting groupInfo');
        const groupData = groupInfo.toObject();
        const joinedUserName = userID ? groupData.users.find(user => user._id.toString() === userID.toString()) : {};
        res.status(200).json({
            status: 'Success',
            data: {
                groupInfo: {
                    ...groupData,
                    joinedUserName: joinedUserName?.username ?? ''
                }
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: 'Something went wrong, Error while getting Group'
        })
    }
}

exports.getGroupInfoByType = async (req, res) => {
    const { groupType } = req.query;
    if (groupType === 'private') throw new Error('Error Invalid query');
    try {
        const groupList = await Room.find({ grouptype: groupType }).populate('users');
        res.status(200).json({
            status: 'Success',
            data: {
                groupList
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: err.message
        })
    }
}


exports.getGroupUser = async (req, res) => {
    const { groupID } = req.query;
    try {
        if (!groupID) throw new Error('Error while getting user list');
        const userList = await Room.findOne({ _id: groupID }, { users: 1, offlineUser: 2 }).populate('users');
        if (!userList) throw new Error('Error while getting user list');
        res.status(200).json({
            status: 'Success',
            data: {
                userList: userList.users,
                offlineUser: userList.offlineUser
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: 'Error while getting user list'
        })
    }
}

exports.leaveGroup = async (req, res) => {
    const { groupID, userID } = req.query;
    try {
        const updatedGroupInfo = await Room.findOneAndUpdate(
            {
                _id: groupID
            },
            {
                $pull: {
                    users: userID
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (updatedGroupInfo.users.length === 0) {
            await Room.findOneAndDelete({ _id: groupID });
        }
        if (!updatedGroupInfo) throw new Error('Error while leaving the group');
        res.status(200).json({
            status: 'Success'
        })
    }
    catch (err) {
        res.status(404).send({
            status: 'Failed',
            type: 'Normal',
            message: 'Error while leaving the group'
        })
    }
}

exports.setOfflineUser = async (req, res) => {
    const { groupID, userID } = req.query;
    try {
        const updatedGroupInfo = await Room.findOneAndUpdate(
            {
                _id: groupID
            },
            {
                $addToSet: {
                    offlineUser: mongoose.Types.ObjectId(userID)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedGroupInfo) throw new Error('Errow while updating the offline users');
        res.status(200).json({
            status: 'Success'
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            type: 'Normal',
            message: err.message
        })
    }
}

exports.getUserGroups = async (req, res) => {
    const { userID } = req.query;
    try {
        const userGroupList = await Room.find(
            {
                users: {
                    $in: [
                        userID
                    ]
                }
            }
        );
        if (!userGroupList) throw new Error('Error while getting user groups');
        res.status(200).json({
            status: 'Success',
            data: {
                userGroupList
            }
        })
    }
    catch (err) {
        res.json({
            status: 'Failed',
            type: 'Normal',
            message: err.message
        })
    }
}
