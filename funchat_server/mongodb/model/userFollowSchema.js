const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserFollowSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId
    },
    follower: {
        type: [Schema.Types.ObjectId],
        ref: 'funChatUser'
    },
    following: {
        type: [Schema.Types.ObjectId],
        ref: 'funChatUser'
    }
});

module.exports = mongoose.model('funChatUserFollowFollowing', UserFollowSchema);
