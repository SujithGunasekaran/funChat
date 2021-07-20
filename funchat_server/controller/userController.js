const User = require('../mongodb/model/userSchema');


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

