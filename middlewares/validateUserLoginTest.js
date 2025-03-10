const { loginTestSchema } = require("./joiSchema")

module.exports.validateUserLoginTest = function (req, res, next) {
    const { error } = loginTestSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next();
    }
}