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

        // socket.on('joinGroupCall', ({ callID, username }, callback) => {
        //     try {
        //         socket.join(callID);
        //         socket.broadcast.to(callID).emit('userConnected', { userName: username });
        //         callback(null);
        //     }
        //     catch (err) {
        //         callback(err);
        //     }
        // })

        socket.on('groupCall', ({ groupToCall, signalData, fromUser, callID }, callback) => {
            try {
                socket.broadcast.to(groupToCall).emit('calling', { groupToCall, signalData, fromUser, callID });
                callback(null);
            }
            catch (err) {
                callback(err);
            }
        })

        socket.on("answerCall", ({ signal, to }) => {
            io.to(to).emit("callAccepted", signal)
        });

        socket.on('joinCall', ({ callID }, callback) => {
            try {
                socket.join(callID);
                callback(null);
            }
            catch (err) {
                callback(err);
            }
        })

        // socket.on('callAccepted', ({ callID, groupName, userName }, callback) => {
        //     try {
        //         socket.join(callID);
        //         io.to(callID).emit('userConnected', { userName });
        //         callback(null);
        //     }
        //     catch (err) {
        //         callback(err);
        //     }
        // })

    })
}
