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

exports.checkIsRoomNameExists = async (req, res, next) => {
    const { roomname } = req.body;
    try {
        const isRoomNameExists = await Room.findOne({ roomname: roomname });
        if (isRoomNameExists) throw new Error('Room name already taken');
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}


exports.createRoom = async (req, res) => {
    try {
        const createdRoomInfo = await Room.create({ ...req.body });
        if (!createdRoomInfo) throw new Error('Error while creating room');
        const roomInfo = await Room.findOne({ _id: createdRoomInfo._id }).populate('users');
        res.status(200).json({
            status: 'Success',
            data: {
                roomInfo
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

exports.joinRoom = async (req, res) => {
    const { roomID = '', userID = '' } = req.query;
    try {
        const joinedRoomInfo = await Room.findOneAndUpdate(
            {
                _id: roomID
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
        if (!joinedRoomInfo) throw new Error('Error while joining room');
        res.status(200).json({
            status: 'Success',
            data: {
                roomID: joinedRoomInfo._id
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


exports.getRoomInfoById = async (req, res) => {
    const { roomID = '' } = req.query;
    try {
        const roomInfo = await Room.findOne({ _id: roomID }).populate('users');
        if (!roomInfo) throw new Error('Error while getting roomInfo');
        res.status(200).json({
            status: 'Success',
            data: {
                roomInfo: {
                    ...roomInfo.toObject(),
                    currentUserIndex: roomInfo.users.length - 1
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

exports.getRoomInfoByType = async (req, res) => {
    const { roomType } = req.query;
    if (roomType === 'private') throw new Error('Error Invalid query');
    try {
        const roomList = await Room.find({ roomtype: roomType }).populate('users');
        res.status(200).json({
            status: 'Success',
            data: {
                roomList
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


exports.getRoomUser = async (req, res) => {
    const { roomID } = req.query;
    try {
        if (!roomID) throw new Error('Error while getting user list');
        const userList = await Room.findOne({ _id: roomID }, { users: 1 }).populate('users');
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
