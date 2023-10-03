const Group = require("../../models/Group.js");
const forumValidator = require("../validators/forum-validator.js");
const fileValidator = require("../validators/file-validator.js");
const isEmpty = require("is-empty");
const multer = require("multer");
const User = require("../../models/User.js");
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require("fs");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'groupPicture')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
exports.uploadImage = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        fileValidator.imageFile(file, cb);
    },
});
exports.insert = (req, res) => {
    let obj;
    if (req?.file) {
        obj = {
            img: {
                data: Buffer.from(fs.readFileSync(req?.file?.path).toString('base64'), 'base64'),
                b64: fs.readFileSync(req?.file?.path).toString('base64'),
                contentType: "image/png",
            },
        };
    }
    let groupRestriction = req.body.groupRestriction;
    console.log(JSON.parse(groupRestriction))
    let groupData = {
        name: req.body.name,
        description: req.body.description,
        members: [req.user._id],
        rules: req.body.rules.split(",").filter(item => item !== ""),
        userIdOwner: req.user._id,
        picture: obj?.img,
        "skillInterests.0.skillInterestId": JSON.parse(groupRestriction).skillInterestId,
        "skillInterests.0.minPoint": JSON.parse(groupRestriction).minPoint
    }
    let group = new Group(groupData);
    group.save()
        .then(async user => res.status(200).send({
            message: "Success",
            group: group
        }))
        .catch(err => res.status(500).send({
            message: err
        }));
};
exports.list = (req, res) => {
    const TOTAL_PER_PAGES = 10;
    let skipped = req.query.page * TOTAL_PER_PAGES
    let agregatePipeline = [];
    if (req.query.userId != null) {
        agregatePipeline.push({
            $match: {
                "members": {
                    $elemMatch: {
                        $in:
                            [new ObjectId(req.query.userId)]
                    }
                }
            }
        })
    }
    agregatePipeline = [...agregatePipeline, {
        $sort: {
            "createdAt": -1
        }
    }, {
        $skip: skipped
    }, {
        $limit: TOTAL_PER_PAGES
    }];

    Group.aggregate(agregatePipeline).then((groups) => {
        return res.status(200).send({
            message: "Success",
            groups: groups
        });
    });
}
exports.detail = (req, res) => {
    Group.findById(req.query.groupId).then(async (group) => {
        if (group != null) {
            let isExp;
            let user;
            let date = new Date();
            const monthInSecond = 30 * 24 * 60 * 60 * 1000;
            let index = group.members.indexOf(group.userIdOwner)
            do {
                user = await User.findById(group.members[index]);
                let expDate = new Date(user.loginDate.getTime() + monthInSecond)
                if (expDate < date) {
                    isExp = true;
                    index++;
                } else {
                    isExp = false;
                    group.userIdOwner = user._id;
                    await group.save();
                }
            } while (isExp);

            return res.status(200).send({
                message: "Success",
                group: group
            });
        } else {
            return res.status(404).send();
        }
    }).catch(e => {
        console.log(e);
        return res.status(500).send();

    });
};
exports.join = (req, res) => {
    Group.findById(req.body.groupId).then(async (group) => {
        if (group != null) {
            let verifiedToJoin = true;
            let userInterestId = req.user.skillinterests.map((skillinterest) => {
                return skillinterest.skillinterestId;
            })
            for (let restriction in group.pointRestriction) {
                if (!userInterestId.includes(restriction.skillInterestId)
                    || req.user.skillinterests[userInterestId.indexOf(restriction.skillInterestId)].point < restriction.minPoint) {
                    verifiedToJoin = false;
                    break;
                }
            }
            if (verifiedToJoin) {
                group.members.push(req.user._id);
                await group.save();
                return res.status(200).send({
                    message: "Success"
                });
            }
            else {
                return res.status(400).send({
                    message: "You are not qualified to join"
                })
            }
        } else {
            return res.status(404).send();
        }
    });
};
exports.leave = (req, res) => {
    Group.findById(req.body.groupId).then(async (group) => {
        if (group != null) {
            if (group.members.includes(req.user._id)) {
                group.members.splice(group.members.indexOf(req.user._id), 1);
                await group.save();
            }
            return res.status(200).send({
                message: "Success"
            });
        } else {
            return res.status(404).send();
        }
    });
}
exports.ban = (req, res) => {
    if (req.user._id == req.body.userId) {
        return res.status(403).send();
    }
    Group.findById(req.body.groupId).then(async (group) => {
        if (group != null) {
            if (group.members.includes(req.body.userId)) {
                group.members.splice(group.members.indexOf(req.body.userId), 1);
            }
            if (!group.bannedUser.includes(req.body.userId)) {
                group.bannedUser.push(req.body.userId);
            }
            await group.save();
            return res.status(200).send({
                message: "Success"
            });
        } else {
            return res.status(404).send();
        }
    });
}
exports.unban = (req, res) => {
    Group.findById(req.body.groupId).then(async (group) => {
        if (group != null) {
            if (group.bannedUser.includes(req.body.userId)) {
                group.bannedUser.splice(group.bannedUser.indexOf(req.body.userId), 1);
            }
            await group.save();
            return res.status(200).send({
                message: "Success"
            });
        } else {
            return res.status(404).send();
        }
    });
}
exports.kick = (req, res) => {
    if (req.user._id == req.body.userId) {
        return res.status(403).send();
    }
    Group.findById(req.body.groupId).then(async (group) => {
        if (group != null) {
            if (group.members.includes(req.body.userId)) {
                group.members.splice(group.members.indexOf(req.body.userId), 1);
                await group.save();
            }
            return res.status(200).send({
                message: "Success"
            });
        } else {
            return res.status(404).send();
        }
    });
}
