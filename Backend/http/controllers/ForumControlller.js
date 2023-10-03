const Thread = require("../../models/Thread.js");
const User = require("../../models/User.js");

const forumValidator = require("../validators/forum-validator.js");
const isEmpty = require("is-empty");

const Group = require("../../models/Group.js");
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer');
const fs = require("fs");
const checkFileType = function (file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
exports.upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
exports.insert = async (req, res) => {
    console.log(req.body.groupId)
    let validationMessage = forumValidator.validateCreateThread(req.body);
    if (!isEmpty(validationMessage)) {
        res.status(400).send({ validationMessage: validationMessage });
    } var obj;
    if (req?.file) {
        obj = {
            img: {
                data: Buffer.from(fs.readFileSync(req?.file?.path).toString('base64'), 'base64'),
                b64: fs.readFileSync(req?.file?.path).toString('base64'),
                contentType: "image/png",
            },
        };
    }

    let threadData = { title: req.body.title, description: req.body.description, picture: obj?.img, skillinterestId: req.body.skillinterestId, userId: req.user._id };
    let group;
    if (req.body.groupId != null) {
        group = await Group.findById(req.body.groupId);
        if (group != null && group.members.includes(req.user._id)) {
            threadData.group = group._id;
        }
    }
    if (req.body.skillinterestId != null) {
        let userInterestId = req.user.skillinterests.map((skillinterest) => {
            return skillinterest.skillinterestId.toString();
        });
        
        let groupInterestId;
        if (group != null || group !== undefined) {
            groupInterestId = group?.skillinterests?.map((skillinterest) => {
                return skillinterest?.skillinterestId?.toString();
            })
        }
        if ((userInterestId.includes(req.body.skillinterestId)) && (groupInterestId == null || groupInterestId.includes(req.body.skillinterestId)) ) {
            if (req.user.skillinterests[userInterestId.indexOf(req.body.skillinterestId)].point < 0) {
                return res.status(203).send({ status: 203, message: "your point is not enough to send post in this topic" })
            }
            threadData.skillinterestId = req.body.skillinterestId;
        }
        else {
            return res.status(500).send({ message: "the group dont contain the interest" })
        }
    }
    let thread = new Thread(threadData);
    thread.save()
        .then(async user => res.status(200).send({ message: "Success", thread: await thread.populate('userId', 'name') })) //disini
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: err })});
};
exports.likeOrUnlike = async (req, res) => {
    Thread.findOne({ _id: req.body.id }).then(async thread => {
        let user;
        let indexOfInterest;
        let userInterestId = req.user.skillinterests.map((skillinterest) => {
            return skillinterest.skillinterestId.toString();
        })
        if (!thread.userId.equals(req.user._id)) {

            if (thread.skillinterestId != null) {
                user = await User.findById(thread.userId).catch(err => res.status(500).send({ message: err }));
                if (user != null) {
                    let posterInterestId = user.skillinterests.map((skillinterest) => {
                        return skillinterest.skillinterestId.toString();
                    })
                    if (posterInterestId.includes(thread.skillinterestId.toString())) {
                        indexOfInterest = posterInterestId.indexOf(thread.skillinterestId.toString())
                    }
                }
            }
            let userIsUpdated = false
            
            if (thread.dislikes.includes(req.user._id)) {
                thread.dislikes.splice(thread.dislikes.indexOf(req.user._id), 1);
                if (indexOfInterest != null) {
                    userIsUpdated = true
                    user.skillinterests[indexOfInterest].point++;
                }
            }
            if (req.user.skillinterests[userInterestId.indexOf(thread.skillinterestId.toString())]?.point < 0) {
                return res.status(203).send({ status: 203, message: "your point is not enough to like post in this topic" })
            }
            if(req.user.skillinterests[userInterestId.indexOf(thread.skillinterestId.toString())] === undefined){
                return res.status(203).send({ status: 203, message: "you don't have interest in that topic!" })
            }
            if (thread.likes.includes(req.user._id)) {
                thread.likes.splice(thread.likes.indexOf(req.user._id), 1);
                if (indexOfInterest != null) {
                    userIsUpdated = true
                    user.skillinterests[indexOfInterest].point--;
                }
            }
            else if (thread.skillinterestId == null || userInterestId.includes(thread.skillinterestId.toString())) {
                thread.likes.push(req.user._id);
                if (indexOfInterest != null) {
                    userIsUpdated = true
                    user.skillinterests[indexOfInterest].point++;
                }
            }
            if (userIsUpdated)
                await user.save().catch(err => res.status(500).send({ message: err }));

            thread.save().then(user => res.status(200).send({ message: "Success" })) //disini
                .catch(err => res.status(500).send({ message: err }));
        } else {
            res.status(401).send({ message: "Can't like your own post" });
        }
    });
}
exports.dislike = async (req, res) => {
    Thread.findOne({ _id: req.body.id }).then(async thread => {
        let user;
        let indexOfInterest;
        let userInterestId = req.user.skillinterests.map((skillinterest) => {
            return skillinterest.skillinterestId.toString();
        })
        if (!thread.userId.equals(req.user._id)) {
            let userIsUpdated = false
            if (thread.skillinterestId != null) {
                user = await User.findById(thread.userId).catch(err => res.status(500).send({ message: err }));
                console.log(user)
                if (user != null) {
                    let posterInterestId = user.skillinterests.map((skillinterest) => {
                        return skillinterest.skillinterestId.toString();
                    })
                    console.log(posterInterestId)
                    console.log(thread.skillinterestId.toString())
                    if (posterInterestId.includes(thread.skillinterestId.toString())) {
                        indexOfInterest = posterInterestId.indexOf(thread.skillinterestId.toString())
                    }
                }
            }
            if (thread.likes.includes(req.user._id)) {
                thread.likes.splice(thread.likes.indexOf(req.user._id), 1);
                if (indexOfInterest != null) {
                    user.skillinterests[indexOfInterest].point--;
                    userIsUpdated = true
                }
            }if (req.user.skillinterests[userInterestId.indexOf(thread.skillinterestId.toString())]?.point < 0) {
                return res.status(203).send({ status: 203, message: "your point is not enough to dislike post in this topic" })
            }if(req.user.skillinterests[userInterestId.indexOf(thread.skillinterestId.toString())] === undefined){
                return res.status(203).send({ status: 203, message: "you don't have interest in that topic!" })
            }

            if (thread.dislikes.includes(req.user._id)) {
                thread.dislikes.splice(thread.dislikes.indexOf(req.user._id), 1);
                if (indexOfInterest != null) {
                    user.skillinterests[indexOfInterest].point++;
                    userIsUpdated = true

                }
            } else if (thread.skillinterestId == null || userInterestId.includes(thread.skillinterestId.toString())) {
                thread.dislikes.push(req.user._id);
                if (indexOfInterest != null) {
                    user.skillinterests[indexOfInterest].point--;
                    userIsUpdated = true
                }
            }
            if (userIsUpdated)
                await user.save().catch(err => res.status(500).send({ message: err }));
            thread.save().then(user => res.status(200).send({ message: "Success" })) //disini
                .catch(err => res.status(500).send({ message: err }));
        }
        else {
            res.status(401).send({ message: "Can't like your own post" });
        }
    });
}
exports.reply = (req, res) => {
    let userInterestId = req.user.skillinterests.map((skillinterest) => {
        return skillinterest.skillinterestId.toString();
    })
    Thread.findById(req.body.id).then(async thread => {
        if (thread != null) {
            let validationMessage = forumValidator.validateReplyThread(req.body);
            if (!isEmpty(validationMessage)) {
                res.status(400).send({ validationMessage: validationMessage });
            }
            else if (thread.skillinterestId == null || userInterestId.includes(thread.skillinterestId.toString())) {
                let reply = new Thread({ description: req.body.description, threadId: req.body.id, userId: req.user._id, skillinterestId: new ObjectId(thread.skillinterestId), threadId: req.body.id });
                await reply.save().then(e => {
                    Thread.find({ threadId: req.body.id }).then(async threads => {
                        threads = await Promise.all(threads.map(async thread => await thread.populate('userId', 'name')));
                        res.status(200).send({ message: "Success", comments: threads });
                    })
                        .catch(err => { res.status(500).send({ message: err }) });
                }).catch(function (err) {
                    // console.log(err)
                    res.status(500).send({ message: "Error" })
                });
            } 
            else {
                res.status(203).send({ status: 203, message: "Not met interest requirement1" })
            }
        }
        else {
            res.status(404).send({ message: "thread not found" });
        }
    }).catch(err=>res.status(500).send({message:err}));
}
exports.forums = (req, res) => {
    const TOTAL_PER_PAGES = 10;
    let skipped = req.query.page * TOTAL_PER_PAGES
    let userId = req.user._id;
    let filter = { threadId: null };
    let agregatePipeline = [];
    if (req.query.groupId != null) {
        filter.group = new ObjectId(req.query.groupId)
    } else {
        filter.group = { $exists: false };
    } if ((req.query.userId) != null) {
        filter.userId = new ObjectId(req.query.userId)
    }
    if (req.query.skillInterestId != 'null' && req.query.skillInterestId != null) {
        if (req.query.skillInterestId == -1) {
            filter.skillinterestId = { $exists: false };
        } else {
            filter.skillinterestId = new ObjectId(req.query.skillInterestId)
        }
    }
    if(req.query.id!=null){
        filter.threadId=new ObjectId(req.query.id)
    }
    agregatePipeline = [{ $match: filter }, { $sort: { "createdAt": -1 } }, { $skip: skipped }, { $limit: TOTAL_PER_PAGES }, {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'postedUser'
        }
    },
    {
        $addFields: {
            "userId.name": { $arrayElemAt: ["$postedUser.name", 0] },
            "userLike": {
                $cond: {
                    if: { $in: [userId, "$likes"] }, then: 1, else: 0
                }
            }, "userDislike": {
                $cond: {
                    if: { $in: [userId, "$dislikes"] }, then: 1, else: 0
                }
            }, "userId.picture": { $arrayElemAt: ["$postedUser.picture.b64", 0] },
            "userId.contentType": { $arrayElemAt: ["$postedUser.picture.contentType", 0] },
        }
    },
    { $project: { numberOfLikes:{$subtract: [ { $size: "$likes" }, { $size: "$dislikes" }]},userDislike:1, title: 1, description: 1, "userId.name": 1, "userId.picture": 1, "userId.contentType": 1, userLike: 1, picture: 1, skillinterestId: 1 } }];
    
    Thread.aggregate(agregatePipeline).then(function (a) {
        res.status(200).send({ message: "Success", thread: a });
    }).catch(function (err) {
        res.status(500).send({ message: err })
    });
}
exports.forum = (req, res) => {
    Thread.findOne({ _id: req.body.id }).then(async thread => {
        res.status(200).send({ message: "Success", thread: await thread.populate('userId', 'name') });

    }).catch(function (err) {
        console.log(err)
        res.status(500).send({ message: "Error" })
    });
}
exports.comments = (req, res) => {
    const paginateNumber = 10;
    Thread.find({ threadId: req.query.id }).then(async threads => {
        threads = await Promise.all(threads.map(async thread => await thread.populate('userId', 'name')));
        res.status(200).send({ message: "Success", comments: threads })
    }).catch(function (err) {
        res.status(500).send({ message: "Error" })
    });
}