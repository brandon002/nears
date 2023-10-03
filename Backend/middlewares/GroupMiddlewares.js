const Group = require("../models/Group.js");
const User = require("../models/User.js");

exports.validateGroupMembership= async (req, res, next) => {
    let groupId ;
    if(req.method==="GET"){
        groupId=req.query.groupId;
    }else if(req.method==="POST"){
        groupId=req.body.groupId;
    }
    let group= await Group.findById(groupId);
      if(group==null||!group.members.includes(req.user._id)){
          return res.sendStatus(401);
      }
      next();
}
exports.validateGroupMembershipIfExist= async (req, res, next) => {
    let groupId ;
    if(req.method==="GET"){
        groupId=req.query.groupId;
    }else if(req.method==="POST"){
        groupId=req.body.groupId;
    }
      let group= await Group.findById(groupId);
      if(group!=null&&!group.members.includes(req.user._id)){
          return res.sendStatus(401);
      }
      next();
}
exports.validateGroupOwnership= async (req, res, next) => {
    let groupId="" ;
    if(req.method==="GET"){
        groupId=req.query.groupId;
    }else if(req.method==="POST"){
        groupId=req.body.groupId;
    }
    if(groupId!=""){
      let group= await Group.findById(groupId);
        console.log(group)
        console.log(req.user._id)
        console.log(group.userIdOwner)
        console.log(!group.userIdOwner.equals(req.user._id))
      if(group==null||!group.userIdOwner.equals(req.user._id)){
          return res.sendStatus(401);
      }}
      next();
}