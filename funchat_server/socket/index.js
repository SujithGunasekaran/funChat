const socketio = require('socket.io');

exports.connectSocket = (app, corsOptions) => {

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

        socket.on('sendMessage', ({ groupName, userId, userName, message }, callback) => {
            try {
                io.to(groupName).emit('chatMessage', { type: 'Normal', user: userName, userId, text: message, date: Date.now() });
                callback(null);
            }
            catch (err) {
                callback(err.message);
            }
        })

        socket.on('setOnlineUser', ({ userName }, callback) => {
            try {
                socket.broadcast.emit('getOnlineUser', { userName });
                callback(null);
            }
            catch (err) {
                callback(err.message);
            }
        })

        socket.on('offlineGroup', ({ groupName, userName, userID, userList }, callback) => {
            try {
                socket.to(groupName).emit('leaveMessage', { type: 'Welcome', userID, user: 'admin', text: `${userName} went offline`, data: Date.now() });
                callback(null);
            }
            catch (err) {
                callback(err.message);
            }
        })

        socket.on('leaveGroup', ({ groupName, userName }, callback) => {
            try {
                socket.to(groupName).emit('leaveMessage', { type: 'Welcome', user: 'admin', text: `${userName} has left`, data: Date.now() });
                callback(null);
            }
            catch (err) {
                callback(err.message);
            }
        })

        socket.on('groupDeleted', ({ groupName, admin }, callback) => {
            try {
                socket.to(groupName).emit('deleteMessage', { message: `Group has been deleted by Admin ${admin}` });
                callback(null);
            }
            catch (err) {
                callback(err.message)
            }
        })

        // video call information 

        socket.on('groupCall', ({ callID, groupName, userName }, callback) => {
            try {
                socket.join(callID);
                socket.broadcast.to(groupName).emit('calling', { callID, groupName, userName });
                callback(null);
            }
            catch (err) {
                callback(err);
            }
        })

        socket.on("answerCall", ({ to, userInfo }) => {
            socket.join(to);
            io.to(to).emit("callAccepted", { userInfo });
        });

        socket.on('updateUserList', ({ users, callID }) => {
            socket.broadcast.to(callID).emit('userList', users);
        })

        socket.on("joinRoom", ({ callID, userInfo }) => {
            socket.join(callID);
            socket.broadcast.to(callID).emit("joinedUserInfo", userInfo);
        });

        socket.on("sendingSignal", ({ userToSignal, signal, callerID, userInfo }) => {
            io.to(userToSignal).emit('userJoined', { signal, callerID, userInfo });
        });

        socket.on("returningSignal", ({ callerID, signal }) => {
            io.to(callerID).emit('receivingReturnedSignal', { signal: signal, id: socket.id });
        });

        socket.on('disconnect', () => {
            console.log("disconnect");
        });

    })
}
