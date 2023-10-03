const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    user_name:{
        type: String
    },
    user_email:{
        type: String
    },
    requestor_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    requestor_name: {
        type: String
    },
    requestor_email: {
        type: String
    },
    status: {
        type: String,
        required: true
    }

})
module.exports = FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);