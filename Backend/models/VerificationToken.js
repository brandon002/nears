const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerificationTokenSchema = new Schema({
    email:{
        type: String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
    
},{ timestamps: true })

module.exports = VerificationToken = mongoose.model("verification-token", VerificationTokenSchema);