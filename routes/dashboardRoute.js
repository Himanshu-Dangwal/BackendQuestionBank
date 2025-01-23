const express = require("express")
const router = express.Router();

const { fetchUser } = require("../middlewares/fetchUser")
const { getQuestions, createQuestion } = require("../controller/dashboardController")
const catchAsync = require("../utils/catchAsync")

router.get("/", fetchUser, catchAsync(getQuestions));

router.post("/createQuestion", catchAsync(createQuestion))

module.exports = router;
