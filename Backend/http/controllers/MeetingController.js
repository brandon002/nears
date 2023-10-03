const Meeting = require('../../models/Meeting.js');

exports.createMeeting = async(req, res) => {
    let user = req.user;
    const meeting = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        platform: req.body.platform,
        attendee: req.body.attendee,
        host:{
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }
    }
    var meet = new Meeting(meeting);
    meet.save()
        .then(async user => res.status(200).send({
            message: "Success",
            meet: meet
        })) 
        .catch(err => res.status(500).send({
            message: err
        }));
}

exports.getMeetingList = async(req,res) => {
    let user = req.user;
    try{
        var findMeeting = await Meeting.find({$or:[{"host.id": user._id.toString()}, {"attendee": { $elemMatch: { value: user._id.toString()} }}]}).exec();
        return res.status(200).send({message: "success", data: findMeeting});
    } catch(err){
        return res.status(500).send({message: err.stack});
    }
}