const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { getQuestions } = require("../controller/dashboardController");
const router = express.Router();



router.get("/", catchAsync(getQuestions));

module.exports = router;