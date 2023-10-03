const Thread = require("../models/Thread");

exports.assignThreadGroupId=async function(req, res, next){
    let threadId;
    if(req.body.id === undefined){
        threadId = req.query.id
    } else{
        threadId = req.body.id
    }
    let thread= await Thread.findById(threadId);
    console.log(thread)
    if(thread!=null){
        if(thread.groupId!=null)
        req.body.groupId=thread.groupId;
        next()
    }
    else{
        return res.sendStatus(401)
    }
}