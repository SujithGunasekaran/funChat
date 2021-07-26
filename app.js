const express = require('express');
const cors = require('cors');
const passport = require('passport');
const socketio = require('socket.io');

require('./funchat_server/passport/googleAuth');
require('./funchat_server/passport/githubAuth');

const mongodb = require('./funchat_server/mongodb');
const middleware = require('./funchat_server/middleware');
const { LOCAL_REDIRECT_URL, PRODUCTION_REDIRECT_URL = '', LOCAL_URL } = require('./funchat_server/config');


// router
const userRoute = require('./funchat_server/router/userRoute');
const groupRoute = require('./funchat_server/router/groupRoute');

// redirect url
const url = process.env.NODE_ENV !== 'production' ? LOCAL_REDIRECT_URL : PRODUCTION_REDIRECT_URL

// Initializing server
const server = express();

const PORT = process.env.PORT || 5000;

server.use(express.json());
server.use(cors({ credentials: true, origin: LOCAL_URL }));

// mongodb connection
mongodb.connectMongodb();

// initializing middleware
middleware.initializeMiddleware(server);

// initializing passport
server.use(passport.initialize());
server.use(passport.session());


// google auth
server.get('/api/google', passport.authenticate('google', { scope: ["profile", "email"] }));

server.get('/google/callback', passport.authenticate('google', { failureRedirect: `${url}/login` }), (req, res) => {
    res.redirect(`${url}/`);
})


// github auth
server.get('/api/github', passport.authenticate('github', { scope: ['user:email'] }));

server.get('/github/callback', passport.authenticate('github', { failureRedirect: `${url}/login` }), (req, res) => {
    res.redirect(`${url}/`);
});


// route path
server.use('/api/v1/user', userRoute);
server.use('/api/v1/group', groupRoute);

// starting the server
const app = server.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`);
})

const corsOptions = {
    cors: true,
    origins: [LOCAL_URL],
}

// socket
const io = socketio(app, corsOptions);

io.on('connection', (socket) => {

    socket.on('join', ({ username, groupname }, callback) => {
        try {
            socket.join(groupname);
            socket.emit('message', { user: 'admin', text: `${username} Welcome to the room ${groupname}` });
            socket.broadcast.to(groupname).emit('chatMessage', { type: 'Welcome', user: 'admin', text: `${username}, has joined`, date: Date.now() });
            callback(null, 'Success');
        }
        catch (err) {
            callback(err, 'Failed');
            return;
        }
    })

    socket.on('sendMessage', ({ groupname, userId, userName, message }, callback) => {
        try {
            io.to(groupname).emit('chatMessage', { type: 'Normal', user: userName, userId, text: message, date: Date.now() });
            callback(null);
        }
        catch (err) {
            callback(err.message);
        }
    })

    socket.on('disconnect', () => {
        console.log("user left");
    })

})
