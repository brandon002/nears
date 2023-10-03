const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestListSchema = new Schema({
    interestName:String,

})

module.exports = Interest = mongoose.model("interests", InterestListSchema);