const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    skillinterestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'skillinterests',
        required: true
    },
    picture: {
        data: Buffer,
        b64: String,
        contentType: String
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }],
    },dislikes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }],
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },

}, {
    timestamps: true
})
ThreadSchema.add({
    threadId: {
            type:mongoose.Schema.Types.ObjectId,
            default: null
    }
})
module.exports = Skill = mongoose.model("threads", ThreadSchema);