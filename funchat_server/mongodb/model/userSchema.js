const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    userid: {
        type: String
    },
    username: {
        type: String,
    },
    profile: {
        type: String
    },
    authType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('funChatUser', UserSchema);
