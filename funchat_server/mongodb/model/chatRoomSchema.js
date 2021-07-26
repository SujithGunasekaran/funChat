const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatRoomSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'funChatUser'
    },
    groupname: {
        type: String
    },
    grouptype: {
        type: String
    },
    groupadmin: {
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('FunChatRooms', ChatRoomSchema);
