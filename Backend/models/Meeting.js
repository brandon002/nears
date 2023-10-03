const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    host: {
        id: String,
        name: String,
        email: String
    },
    title: String,
    description: String,
    type: String,
    platform: String,
    attendee: [{
        value: String,
        label: String
    }]
})
module.exports = Meeting = mongoose.model("Meeting", MeetingSchema);