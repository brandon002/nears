const SkillInterest = require('../../models/SkillInterest.js');
const mongoose = require('mongoose');
const mongoDBConfig = require('../../config/db.config.js');

/*
SkillInterest
Programming
Gaming
Science
Finance 
*/
const DEFAULT_SKILL_INTEREST = [{ "skillInterestName": "Programming" }, { "skillInterestName": "Gaming" }, { "skillInterestName": "General" }, { "skillInterestName": "Science" }, { "skillInterestName": "Finance" }]
mongoose.connect(mongoDBConfig.url, mongoDBConfig.connectOptions)
    .catch((e) => {
        console.error("failed connect to mongodb", e)
    }).then((a) => {
        seedSkillInterest(DEFAULT_SKILL_INTEREST)
    })

async function seedSkillInterest(skillInterests) {
    try {
        await SkillInterest.insertMany(skillInterests).catch((e) => {
            throw (e);
        });
        console.log('seeding successfull');
    }
    catch (e) {
        console.error('Error seeding database:' + e);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}
