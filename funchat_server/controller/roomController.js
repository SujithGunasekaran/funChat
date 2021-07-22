const Room = require('../mongodb/model/chatRoomSchema');

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


exports.getRoomInfoById = async (req, res) => {
    const { roomID = '' } = req.query;
    try {
        const roomInfo = await Room.findOne({ _id: roomID }).populate('users');
        if (!roomInfo) throw new Error('Error while getting roomInfo');
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
