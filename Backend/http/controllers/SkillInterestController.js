const SkillInterest = require('../../models/SkillInterest.js');
const mongoose = require('mongoose');
const User = require('../../models/User.js');
const Group = require('../../models/Group.js');
const ObjectId = require('mongoose').Types.ObjectId;
exports.getAllSkillInterest = async (req, res) => {
    try {
        let filter = [{ $match: {} }];
        let skillInterestsList;
        if (req.query.userId != null) {
            let user = await User.findById(req.query.userId)
            let userInterestId = user.skillinterests.map((skillinterest) => {
                return skillinterest.skillinterestId.toString();
            })
            filter.push({
                $match: {
                    skillinterests: { $in: userInterestId }
                }
            });
        } else if (req.query.groupId != null) {
            let group = await Group.findById(req.query.userId)
            let groupInterestId = group.skillinterests.map((skillinterest) => {
                return skillinterest.skillinterestId.toString();
            })
            filter.push({
                $match: {
                    skillinterests: { $in: groupInterestId }
                }
            });
        }
        skillInterestsList = await SkillInterest.aggregate(filter)
        return res.status(200).send({ InterestSkill: skillInterestsList });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ message: e });
    }
}
exports.getLeaderboard = async (req, res) => {
    User.aggregate([{
        $project: {
            "name": "$name",
            "importantInterest": {
                $arrayElemAt: [{
                    $filter: {
                        input: "$skillinterests",
                        as: "item",
                        cond: {
                            $eq: ["$$item.skillinterestId", new ObjectId(req.query.skillInterestId)]
                        }
                    }
                }, 0]
            },
        },
    }, {
        $match: {
            "importantInterest": {
                $exists: true,$ne:null
            }
        }
    }, {
        $sort: {
            "importantInterest.poin": -1 // or -1 for descending order
        },
    }, {
        $limit: Number(req.query.limit),
    }]).then(e => {
        return res.status(200).send({
            user: e
        });
    }).catch(e => {
        console.log(e)
        res.status(500).send({
            message: e
        })
    });
}