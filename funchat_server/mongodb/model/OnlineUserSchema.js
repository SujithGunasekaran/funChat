const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OnlineUserSchema = new Schema({
    userid: Schema.Types.ObjectId,
    username: String,
    statusType: String,
    profile: String
});


module.exports = mongoose.model('funChatOnlineUser', OnlineUserSchema);
