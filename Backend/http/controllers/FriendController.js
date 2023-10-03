const FriendRequest = require("../../models/FriendRequest.js");
const Friend = require("../../models/Friend.js");
const User = require("../../models/User.js");
const ObjectID = require('mongodb').ObjectId;
exports.addRequest = async(req, res) => {
    let user = req.user;
    let _idU = new ObjectID(req.body.id);

    try{
        var userFound = await User.findOne({_id: _idU}).exec();
        await FriendRequest.replaceOne({user_id: _idU, requestor_id: new ObjectID(user.id)},
            {user_id: _idU, user_name: userFound.name, user_email: userFound.email, requestor_id: user.id, requestor_name: user.name, requestor_email: user.email, status: "PENDING"},
            {upsert: true}
        ).exec();
        return res.status(200).send({message: "success"});
    } catch(err){
        return res.status(500).send({message: err.stack});
    };
}
exports.getRequets = async(req,res) => {
    let user = req.user;
    try{
       var prom = await FriendRequest.find({requestor_id: new ObjectID(user.id)}).exec();
       return res.status(200).send({message: "success", data: prom})
    } catch(err){
        return res.status(500).send({message: err})
    }
}
exports.getRequestReceived = async(req,res) => {
    let user = req.user;
    try{
        var prom = await FriendRequest.find({user_id: new ObjectID(user.id)}).exec();
        return res.status(200).send({message:"success", data:prom})
    } catch(err){
        return res.status(500).send({message:err.stack});
    }
}
exports.acceptRequest = async(req,res) => {
    let user = req.user;
    let req_id = new ObjectID(req.body.id)
    try{
        var userFound = await User.findOne({_id: req_id});
        var userObj = {
            id: userFound.id,
            name: userFound.name,
            role: userFound.nickName,
            b64: userFound.picture.b64,
            email: userFound.email
        }
        var userObjFriend = {
            id: user.id,
            name: user.name,
            role: user.nickName,
            b64: user.picture.b64,
            email: user.email
        }

        await Friend.updateOne({friend_id: {$in: [`${userFound.id}${user.id}`, `${user.id}${userFound.id}`]} },
            {   
                friend_id: `${userFound.id}${user.id}`,
                user_id: userObj,
                user_friend_id: userObjFriend
            },
            {upsert: true}
        )
        await FriendRequest.deleteOne({user_id: user.id, requestor_id: req_id, status: "PENDING"})
        return res.status(200).send({message: "success"})
    } catch(err){
        return res.status(500).send({message: err.stack})
    }
}
exports.removeRequest = async(req, res) => {
    let user = req.user;
    let _idU = new ObjectID(req.body.id);
    try{
        var prom = await FriendRequest.deleteOne({user_id: _idU, requestor_id: user.id, status: "PENDING"}).exec();

        return res.status(200).send({message: "success", data: prom});
    } catch(err){
        return res.status(500).send({message:err.stack});
    }
}
exports.getFriend = async(req,res) => {
    let user = req.user;
    try{
        //klo not found array kosong []
        var friendFound = await Friend.find({friend_id: { "$regex": `${req.body.id}${user.id}`, "$options": "i" } }).exec();
        var mutulFriend = await Friend.find({friend_id: { "$regex": req.body.id, "$options": "i" } }).exec();
        return res.status(200).send({message: "success", data: friendFound, mutualFriend: mutulFriend});
    } catch(err){
        return res.status(500).send({message: err.stack})
    }
}