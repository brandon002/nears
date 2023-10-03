const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const keys = require("../../config/db.config.js");
const emailConfig = require("../../config/email.config.js");
const nodemailer = require("nodemailer")
const validateRegisterInput = require("../authentication/register.js");
const validateLoginInput = require("../authentication/login.js");
const validateResetPasswordInput = require("../validators/reset-password");
const User = require("../../models/User.js");
const ResetPassword = require("../../models/ResetPassword");
const VerificationToken = require("../../models/VerificationToken.js");
const multer = require('multer');
const fs = require("fs");
const SkillInterest = require("../../models/SkillInterest.js");
const ObjectID = require('mongodb').ObjectId;
const axios = require('axios');
const checkFileType = function (file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};
exports.register = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).send(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).send({ code: 100, message: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) { throw err; }
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(async user => {
                            await sendVerifiedEmail(user.email)
                            res.status(200).send({ code: 200, message: "Success.Your verification email has already been sent", data: user })}) //disini
                        .catch(err => console.log(err));
                });
            });
            return;
        }
    }).catch(err => console.log(err));
};
exports.login = async(req, res) => {
    const { errors, isValid } = validateLoginInput(req.body.value);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=6LeE4asmAAAAACtP1XmUzOtUQ3hkTGjist4Hv5gO&response=${req.body.captcha}`
    );
    if(response.data.success){
        const email = req.body.value.email;
        const password = req.body.value.password;
        
        User.findOne({ email }).then(user => {
            if (!user) {
                return res.status(300).json({ code: 300, message: "Invalid password or account does not exists" });
            }
            bcrypt.compare(password, user.password).then(async isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name
                    };
                    user.loginDate = new Date();
                    if(user.verified){
                    await user.save()
                    jwt.sign(
                        payload,
                        keys.secretKey,
                        {
                            expiresIn: 5000000
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: token
                            });
                        }
                    );}
                    else{
                       await sendVerifiedEmail(user.email).catch(e=>res.status(e.code).json({message: e.message}))
                       return res.status(202).json({message:"email is not verified.check your email for verification link"})
                    }
                } else {
                    return res
                        .status(400)
                        .json({ passwordincorrect: "Password incorrect" });
                }
            });
        });    
    } else {
        res.status(500).send("ROBOT")
    }
};
exports.requestForgotPassword = async (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
        else {
            let resetPassword;
            let resetPasswordId;
            let resetToken = crypto.randomBytes(32).toString("hex");
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(resetToken, salt, (err, crypt) => {
                    if (err) throw (err);
                    resetPassword = new ResetPassword({ email: req.body.email, token: crypt });
                    resetPassword.save().then(value => {
                        let transport = nodemailer.createTransport({
                            host: emailConfig.emailAccount.host, port: emailConfig.emailAccount.port, secure: true, auth: {
                                user: emailConfig.emailAccount.address,
                                pass: emailConfig.emailAccount.password
                            }
                        });
                        const payload = {
                            resetToken: resetToken,
                            resetPasswordId: value._id
                        };
                        jwt.sign(
                            payload,
                            keys.secretKey,
                            {
                                expiresIn: "1h"
                            },
                            (err, token) => {
                                transport.sendMail({
                                    from: "nears", to: `${user.email},${user.email}`,
                                    subject: emailConfig.forgotPassword.subject, text: "Click this link to verify your email"
                                    , html: emailConfig.forgotPassword.html.replaceAll(":url", `http://localhost:3000/#/reset-password?resetToken=${token}&email=${user.email}`).replaceAll(":name", user.name)
                                }).then((value) => {
                                    if (value.accepted) {

                                        return res.status(200).json({ message: "success" });
                                    }
                                });
                            }
                        );
                    }).catch(err => console.log(err));
                })
            });

        }
    });

}
function generateResetPasswordToken(email, callback) {
    let resetToken = crypto.randomBytes(32).toString("hex");
    let resetClientToken;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(resetToken, salt, async (err, crypt) => {
            if (err) throw (err);
            let resetPassword;
            resetPassword = new ResetPassword({ email: email, token: crypt });
            resetPassword.save().then((value) => {
                const payload = {
                    resetToken: resetToken,
                    resetPasswordId: value._id
                };
                jwt.sign(
                    payload,
                    keys.secretKey,
                    {
                        expiresIn: "1h"
                    },
                    (err, token) => {
                        if (err) throw err;
                        callback(token);
                    });
            })
        });
    });
}
exports.resetPassword = async (req, res) => {
    let tokenIsValid = true;
    try {
        let token = jwt.verify(req.body.resetToken, keys.secretKey);

        await ResetPassword.findOne({ _id: token["resetPasswordId"] }).then(resetPassword => {
            if (resetPassword != null) {
                bcrypt.compare(token["resetToken"], resetPassword.token).then(valid => {
                    if (valid && req.body.email == resetPassword.email) {
                        User.findOne({ email: req.body.email }).then(user => {
                            const { errors, isValid } = validateResetPasswordInput(req.body, user.password);
                            if (!isValid) {
                                return res.status(400).json({ validationMessage: errors });
                            }
                            else
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(req.body.password, salt, async (err, hash) => {
                                        if (err) throw err;
                                        user.password = hash;
                                        resetPassword.deleteOne();
                                        await user
                                            .save()
                                            .then(user => {
                                                return res.status(200).send({ code: 200, message: "Success", data: user });
                                            }) //disini
                                            .catch(err => console.log(err));

                                    });
                                });
                        });
                    }
                    else {
                        tokenIsValid = false;
                    }
                });
            }
            else {
                tokenIsValid = false;
            }
        });
    }
    catch (e) {
        console.log(e);
        tokenIsValid = false
    }
    if (!tokenIsValid) {
        return res.status(400).json({ message: "reset token not valid" });
    }
}
exports.editProfile = (req, res) => {
    let user = req.user;
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.nickName = req.body.nickName;
    user.phone = req.body.phone;
    user.hobby = req.body.hobby;
    user.address = req.body.address;
    user.gender = req.body.gender;
    user.description = req.body.description;
    user.birthdayDate = req.body.dob;
    user.save();
    return res.status(200).send({ message: "succcessful" });
}
exports.getProfile =async (req, res) => {
    letpopulatedUser=await req.user.populate('skillinterests.skillinterestId', 'skillInterestName');
    let userPlain = letpopulatedUser.toObject();
    delete userPlain.password
    delete userPlain.createdAt;
    delete userPlain.updatedAt;
    return res.status(200).send({ data: userPlain });
}
exports.verifyPassword = async (req, res) => {
    let user = req.user;
    bcrypt.compare(req.query.password, user.password).then(async isMatch => {
        if (isMatch) {
            generateResetPasswordToken(user.email, (token) => {
                return res.status(200).send({ resetToken: token, message: "verified" });
            })
        }
        else {
            return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
        }
    });
}
exports.getInterests = (req, res) => {
    Interest.find({ userId: req.user.id }).then(interests => {
        res.status(200).send({ interests: interests });
    });
}
exports.editInterest = async (req, res) => {
    let user = req.user;
    let interest = req.body;
    let interestArr = [];
    interest.map((element, index) => {
        if (element !== null) {
            interestArr.push(element)
        } else {
            interestArr.push('')
        }
    });
    try {
        await User.updateOne({ _id: user.id }, { interests: interestArr.join() }).exec();
        await Interest.replaceOne({ userId: user.id }, { userId: user.id, interests: interestArr }, { upsert: true }).exec();
        return res.status(200).send({ message: "success" })
    } catch (err) {
        return res.status(500).send({ message: err })
    }

}
exports.getSkills = (req, res) => {
    Skill.find({ userId: req.user.id }).then(skills => {
        res.status(200).send({ skills: skills });
    });
}
exports.getUser = async(req, res) => {
    let _idU = new ObjectID(req.user._id)

    User.find({ _id: { $ne: _idU } }).then(async users => {
        await User.populate('skillinterests.skillinterestId', 'skillInterestName')
        res.status(200).send({ users: users, message: 'success' });
    });
}
exports.getUserDetail = async(req, res) => {
    var userFind = await User.findById(req.body.id);
    var prom = await userFind.populate('skillinterests.skillinterestId', 'skillInterestName');
    try{
        return res.status(200).send({ message: "Success", data: prom });
    } catch(error){
        return res.status(500).send({ message: error });
    }
}
exports.editSkill = async (req, res) => {
    let user = req.user;
    let interest = req.body;
    let interestArr = [];
    interest.map((element, index) => {
        if (element !== null) {
            interestArr.push(element)
        } else {
            interestArr.push('')
        }

    });
    try {
        await User.updateOne({ _id: user.id }, { skills: interestArr.join() }).exec();
        await Skill.replaceOne({ userId: user.id }, { userId: user.id, skills: interestArr }, { upsert: true }).exec();
        return res.status(200).send({ message: "success" })
    } catch (err) {
        return res.status(500).send({ message: err.stack })
    }
}
exports.editSkillInterest = async (req, res) => {
    let user = req.user;
    let interestBody = req.body
    let userInterestId = req.user.skillinterests.map((skillinterest) => {
        return skillinterest.skillinterestId.toString();
    })
    if (interestBody.length > 10) {
        interestBody = req.body.sort((a, b) => {
            return userInterestId.includes(a) - userInterestId.includes(b);
        });
    }
    let interests = [...new Set(interestBody)].slice(0, 10);
    let generalSkillInterest= await SkillInterest.findOne({"skillInterestName":"General"});
    try {
        for (let skillinterest of req.user.skillinterests) {
            if (!interests.includes(skillinterest.skillinterestId.toString())&&(generalSkillInterest==null||!generalSkillInterest._id.equals(skillinterest.skillinterestId))) {
                req.user.skillinterests.splice(req.user.skillinterests.indexOf(skillinterest), 1);
            }
        }
        req.user.skillinterests
            .push(...interests
                .filter((element) => !userInterestId.includes(element)).map((element) => {
                    return { skillinterestId: element, };
                })
            );
        req.user.save().catch(e => { throw (e) }).then(e => res.status(200).send({ "message": "success" }));
    } catch (err) {
        return res.status(500).send({ message: err.stack })
    }
}
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
exports.uploadImageUser = (async (req, res) => {
    if (req?.file) {
        const obj = {
            img: {
                data: Buffer.from(fs.readFileSync(req?.file?.path).toString('base64'), 'base64'),
                b64: fs.readFileSync(req?.file?.path).toString('base64'),
                contentType: "image/png",
            },
        };
        try {
            const updateUser = await User.updateOne({ email: req.user.email }, { picture: obj?.img });
            return res.status(200).send({ message: "success", data: updateUser });
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    }
    return res.status(400).send({ message: "No image inserted" });
})
async function  sendVerifiedEmail  (email) {
    let user=await User.findOne({ email: email})
    if (!user) {
        throw("email not found")
     }
     else {
         let verificationToken = crypto.randomBytes(32).toString("hex");
         bcrypt.genSalt(10, (err, salt) => {
             bcrypt.hash(verificationToken, salt, (err, crypt) => {
                 if (err) throw (err);
                 verificationTokenModel = new VerificationToken({ email:email, token: crypt });
                 verificationTokenModel.save().then(value => {
                     let transport = nodemailer.createTransport({
                         host: emailConfig.emailAccount.host, port: emailConfig.emailAccount.port, secure: true, auth: {
                             user: emailConfig.emailAccount.address,
                             pass: emailConfig.emailAccount.password
                         }
                     });
                     const payload = {
                         verificationToken: verificationToken,
                         verificationTokenId: value._id
                     };
                     jwt.sign(
                         payload,
                         keys.secretKey,
                         {
                             expiresIn: "1h"
                         },
                         (err, token) => {
                             console.log(token);
                             transport.sendMail({
                                 from: "nears", to: `${user.email},${user.email}`,
                                 subject: emailConfig.emailVerification.subject, text: "Click this link to verify your email"
                                 , html: emailConfig.emailVerification.html.replaceAll(":url", `http://localhost:3000/#/verificationPage?token=${token}&email=${user.email}`).replaceAll(":name", user.name)
                             }).then((value) => {
                                 console.log(value);
                                 if (value.accepted) {

                                     return { message: "success" };
                                 }
                             }).catch((e) => {
                                 console.log(e)
                                  throw({ message: e });
                             });
                         }
                     );
                 }).catch(err => console.log(err));
             })
         });

     }
}

exports.sendVerifiedEmail = async (email) => {
    let user=await User.findOne({ email: email})
    if (!user) {
        throw("email not found")
     }
     else {
         let verificationToken = crypto.randomBytes(32).toString("hex");
         bcrypt.genSalt(10, (err, salt) => {
             bcrypt.hash(verificationToken, salt, (err, crypt) => {
                 if (err) throw (err);
                 verificationTokenModel = new VerificationToken({ email:email, token: crypt });
                 verificationTokenModel.save().then(value => {
                     let transport = nodemailer.createTransport({
                         host: emailConfig.emailAccount.host, port: emailConfig.emailAccount.port, secure: true, auth: {
                             user: emailConfig.emailAccount.address,
                             pass: emailConfig.emailAccount.password
                         }
                     });
                     const payload = {
                         verificationToken: verificationToken,
                         verificationTokenId: value._id
                     };
                     jwt.sign(
                         payload,
                         keys.secretKey,
                         {
                             expiresIn: "1h"
                         },
                         (err, token) => {
                             console.log(token);
                             transport.sendMail({
                                 from: "nears", to: `${user.email},${user.email}`,
                                 subject: emailConfig.emailVerification.subject, text: "Click this link to verify your email"
                                 , html: emailConfig.emailVerification.html.replaceAll(":url", `http://localhost:3000/#/verificationPage?token=${token}&email=${user.email}`).replaceAll(":name", user.name)
                             }).then((value) => {
                                 console.log(value);
                                 if (value.accepted) {

                                     return { message: "success" };
                                 }
                             }).catch((e) => {
                                 console.log(e)
                                  throw({ message: e });
                             });
                         }
                     );
                 }).catch(err => console.log(err));
             })
         });

     }
}
exports.verifyEmail = async (req, res) => {
    let tokenIsValid = true;
    try {
        let token = jwt.verify(req.body.verifToken, keys.secretKey);
        await VerificationToken.findOne({ _id: token["verificationTokenId"] }).then(async verificationToken => {
            console.log(verificationToken)
            if (verificationToken != null) {
                await bcrypt.compare(token["verificationToken"], verificationToken.token).then(async valid => {
                    console.log(valid)
                    console.log(req.body.email == verificationToken.email)
                    if (valid && req.body.email == verificationToken.email) {
                        User.findOne({ email: req.body.email }).then(user => {
                            user.verified = true;
                            user.save();
                            verificationToken.deleteOne()
                            return res.status(200).json({ message: "success" });
                        });
                    }
                    else {
                        tokenIsValid = false;
                    }
                });
            }
            else {
                tokenIsValid = false;
            }
        });
    }
    catch (e) {
        console.log(e);
        tokenIsValid = false
    }
    if (!tokenIsValid) {
        return res.status(400).json({ message: "verified token not valid" });
    }
}