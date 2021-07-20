const session = require('express-session');
const { mongodbSessionStorage } = require('../mongodb');
const { SESSION_SECRET } = require('../config');

exports.initializeMiddleware = (server) => {

    const sessionInfo = {
        name: 'funChatSession',
        secret: SESSION_SECRET,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        resave: false,
        saveUninitialized: false,
        store: mongodbSessionStorage()
    }

    server.use(session(sessionInfo));

}
