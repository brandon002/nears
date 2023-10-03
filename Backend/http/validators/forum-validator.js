const Validator = require("validator");
const isEmpty = require("is-empty");
const Group = require("../../models/Group");

function validateGroupMembership(user,groupId){
 let group= Group.findById(groupId)
 let isValid=false;
 if(group!=null){
    
 }
 return isValid
}
exports.validateCreateThread=(request)=>{
    let validationMessage={};
    if(!Object.prototype.hasOwnProperty.call(request, 'title')||Validator.isEmpty(request.title)){
        validationMessage.title="title is required";
    }
    if(!Object.prototype.hasOwnProperty.call(request, 'description')||Validator.isEmpty(request.description)){
        validationMessage.description="description is required";
    }
   
    return validationMessage;
}
exports.validateReplyThread=(request)=>{
    let validationMessage={};
    if(!request.hasOwnProperty("description")||Validator.isEmpty(request.description)){
        validationMessage.description="description is required";
    }
    return validationMessage;
}