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
            message: err.message
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
            message: err.message
        })
    }
}


exports.createGroup = async (req, res) => {
    try {
        const createdGroupInfo = await Room.create({ ...req.body });
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
            message: err.message
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
            message: err.message
        })
    }
}


exports.getGroupInfoById = async (req, res) => {
    const { groupID = '' } = req.query;
    try {
        const groupInfo = await Room.findOne({ _id: groupID }).populate('users');
        if (!groupInfo) throw new Error('Error while getting roomInfo');
        res.status(200).json({
            status: 'Success',
            data: {
                groupInfo: {
                    ...groupInfo.toObject(),
                    currentUserIndex: groupInfo.users.length - 1
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
            message: err.message
        })
    }
}


exports.getGroupUser = async (req, res) => {
    const { groupID } = req.query;
    try {
        if (!groupID) throw new Error('Error while getting user list');
        const userList = await Room.findOne({ _id: groupID }, { users: 1 }).populate('users');
        if (!userList) throw new Error('Error while getting user list');
        res.status(200).json({
            status: 'Success',
            data: {
                userList
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