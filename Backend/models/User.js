const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const skillinterestSchema=require("./SkillInterest.js")
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },verified: {
        type: Boolean,
        required: true,
        default:true
    },
    nickName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    hobby: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    description: {
        type: String
    },
    birthdayDate: {
        type: Date,
    },
    loginDate: {
        type: Date,
    },
    gender: {
        type: String,
    },

    skillinterests: [{
        skillinterestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'skill-interests',
            required: true
        },
        point:{  type: Number,default:0}
    }],
    picture: {
        data: Buffer,
        b64: String,
        contentType: String
    }

}, { timestamps: true })
UserSchema.pre('save', async function (next) {
    if (!this.skillinterests) {
      // If sourceId is not already set, query the source collection and find a document based on field1 value
      const skillinterestsData = await skillinterestSchema.findOne({ skillInterestName: 'General' });
      if (skillinterestsData) {
        // If a document is found, set sourceId to its ID
        this.skillinterests = [{skillinterestId:skillinterestsData._id}];
      }
    }
    next();
  });
module.exports = User = mongoose.model("users", UserSchema);