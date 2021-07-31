const User = require('../mongodb/model/userSchema');

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
        res.status(200).json({
            status: 'Success',
            data: {
                userInfo,
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
}
