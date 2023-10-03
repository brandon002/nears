const jwt = require("jsonwebtoken");
const keys = require("../config/db.config.js");
const User = require("../models/User.js");

exports.authUser = (req, res, next) => {
    let authToken = req.headers['authorization'];
    try {
        let userSession = jwt.verify(authToken, keys.secretKey);
        User.findOne({ _id: userSession["id"] }).then(user => {
            if (user != null) {
                req.user = user;
                next();
            }
            else {
                return res.sendStatus(403);
            }
        })
    } catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }
}
exports.emailIsverified = (req, res, next) => {
    if(!req.user.verified){
        return res.sendStatus(401);
    }
    next()
}