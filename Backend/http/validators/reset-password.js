const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcryptjs");

module.exports = function validateResetPasswordInput(data,oldPassword) {
    let errors = {};
    Validator.confirmPassword
  
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6})) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must match";
    }
    if (bcrypt.compareSync(data.password,oldPassword)) {
        errors.password = "Passwords can't be same with old password";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};