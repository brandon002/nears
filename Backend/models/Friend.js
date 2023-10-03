const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    friend_id: String,
    user_id: {
        id: String,
        name: String, 
        role: String,
        b64: String,
        email: String
    },
    user_friend_id: {
        id: String,
        name: String, 
        role: String,
        b64: String,
        email: String
    },
})
module.exports = Friend = mongoose.model("Friend", FriendSchema);