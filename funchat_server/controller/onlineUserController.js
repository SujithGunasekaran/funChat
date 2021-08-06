const OnlineUser = require('../mongodb/model/OnlineUserSchema');

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

exports.setOnlineUser = async (req, res) => {
    try {
        const savedUser = await OnlineUser.create({
            userid: req.body.userid,
            username: req.body.username,
            statusType: req.body.statusType,
            profile: req.body.profile
        });
        if (!savedUser) throw new Error('Errow while saving the online user');
        res.status(200).json({
            status: 'Success'
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err.message
        })
    }
}

exports.getOnlineUser = async (req, res) => {
    try {
        const userList = await OnlineUser.find({});
        if (!userList) throw new Error('Error while getting offline user');
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
