const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skillInterests:[{
        skillInterestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'skillinterests',
            required: true
        },
        minPoint: {type:Number,default:0}
    }], 
    rules: [String],
    picture: {
        data: Buffer,
        b64: String,
        contentType: String
    },
    members: {
        type: [ {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
       ],
    },
    bannedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    userIdOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
}, {
    timestamps: true
})

module.exports = Group = mongoose.model("groups", GroupSchema);