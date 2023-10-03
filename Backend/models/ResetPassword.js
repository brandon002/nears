const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
    email:{
        type: String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
    
},{ timestamps: true })

module.exports = ResetPassword = mongoose.model("reset-passwords", ResetPasswordSchema);