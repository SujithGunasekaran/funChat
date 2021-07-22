const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatRoomSchema = new Schema({

    users: {
        type: [Schema.Types.ObjectId],
        ref: 'funChatUser'
    },
    roomname: {
        type: String
    },
    roomtype: {
        type: String
    }
});

module.exports = mongoose.model('FunChatRooms', ChatRoomSchema);
