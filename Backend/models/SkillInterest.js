const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillInterestSchema = new Schema({
    skillInterestName:String,

})

module.exports = SkillInterest = mongoose.model("skill-interests", SkillInterestSchema);