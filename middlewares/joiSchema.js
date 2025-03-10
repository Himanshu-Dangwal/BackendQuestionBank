const Joi = require('joi');

module.exports.userSchema = Joi.object({
    username: Joi.string().required().alphanum().min(3).max(25),
    password: Joi.string().required().min(5)
})

module.exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(5),
    captchaValue: Joi.string().required()
})

module.exports.loginTestSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(5)
})