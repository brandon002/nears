require("../models/User.js")
const cors = require('cors');
const AuthMiddleware = require('../middlewares/AuthMiddlewares');
const ForumMiddleware = require('../middlewares/ForumMiddlewares');
const GroupMiddleware = require('../middlewares/GroupMiddlewares');

const bodyParser = require('body-parser');

module.exports = app => {
    app.use(cors())
    const Users = require("../http/controllers/UserController.js");
    const Forums = require("../http/controllers/ForumControlller.js");
    const Friends = require("../http/controllers/FriendController.js");
    const GroupController = require("../http/controllers/GroupController.js");
    const SkillInterestsController = require("../http/controllers/SkillInterestController.js");
    const Meeting = require("../http/controllers/MeetingController.js")
    var router = require("express").Router();
    router.post("/register", Users.register);
    router.post("/login", Users.login);
    router.post("/forgot-password", Users.requestForgotPassword);
    router.post("/reset-password", Users.resetPassword);
    router.post("/interests", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.editInterest);
    router.post("/skills", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.editSkill);
    router.post("/edit-profile", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.editProfile);
    router.post("/user-picture", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.upload.single('picture'), Users.uploadImageUser);
    router.post("/user-detail", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.getUserDetail);
    router.post("/get-users", AuthMiddleware.authUser, Users.getUser);
    router.post("/add-friend-request", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.addRequest);
    router.post("/remove-friend-request", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.removeRequest);
    router.post("/accept-friend-request", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.acceptRequest);
    router.get("/get-friend-request", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.getRequets);
    router.get("/get-friend-request-received", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.getRequestReceived);
    router.get("/resetToken", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.verifyPassword);
    router.get("/user", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.getProfile);
    router.get("/interests", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.getInterests);
    router.get("/skills", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.getSkills);
    router.get("/threads", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupMembershipIfExist
        , Forums.forums)
    router.get("/thread", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, ForumMiddleware.assignThreadGroupId
        , GroupMiddleware.validateGroupMembershipIfExist, Forums.forum)
    router.post("/comment", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, ForumMiddleware.assignThreadGroupId
        , GroupMiddleware.validateGroupMembershipIfExist, Forums.reply)
    router.get("/comments", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, ForumMiddleware.assignThreadGroupId
        , GroupMiddleware.validateGroupMembershipIfExist, Forums.forums)
    router.post("/thread", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupMembershipIfExist
        , Forums.upload.single("image"), Forums.insert)
        router.post("/dislike", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, ForumMiddleware.assignThreadGroupId
        , GroupMiddleware.validateGroupMembershipIfExist, AuthMiddleware.emailIsverified, Forums.dislike)
    router.post("/like", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, ForumMiddleware.assignThreadGroupId
        , GroupMiddleware.validateGroupMembershipIfExist, AuthMiddleware.emailIsverified, Forums.likeOrUnlike)
    router.get("/get-users", AuthMiddleware.authUser, Users.getUser);
    // router.post("/add-friend", AuthMiddleware.authUser, Users.addRemoveRequest);
    router.post("/group", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupController.uploadImage.single("groupPicture"), GroupController.insert);
    router.get("/group", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupMembership, GroupController.detail);
    router.get("/groups", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupController.list);
    router.get("/joinedGroup", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupController.list);
    router.post("/banFromGroup", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupOwnership, GroupController.ban);
    router.post("/kickFromGroup", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupOwnership, GroupController.kick);
    router.post("/leave", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupMiddleware.validateGroupMembership, GroupController.leave);
    router.post("/membership", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, GroupController.join);
    router.post("/get-friend", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Friends.getFriend);
    router.post("/create-meeting", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Meeting.createMeeting);
    router.post("/get-meeting-list", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Meeting.getMeetingList);
    router.get("/skillInterests", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, SkillInterestsController.getAllSkillInterest);
    router.post("/skillInterests", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, Users.editSkillInterest);
    router.post("/emailVerification", Users.sendVerifiedEmail);
    router.get("/leaderboard", AuthMiddleware.authUser, AuthMiddleware.emailIsverified, SkillInterestsController.getLeaderboard);
    router.post("/verified", Users.verifyEmail);

    app.use(bodyParser.json());

    app.use('/api/users', router);
};