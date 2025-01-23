const express = require("express")
const router = express.Router();

const { loginHandler, signupHandler } = require("../controller/authController")
const catchAsync = require("../utils/catchAsync")
const { validateUserLogin } = require("../middlewares/validateUserLogin")
const { validateUserSignup } = require("../middlewares/validateUserSignup")


router.post("/login", validateUserLogin, catchAsync(loginHandler));


router.post("/signup", validateUserSignup, catchAsync(signupHandler));

module.exports = router;