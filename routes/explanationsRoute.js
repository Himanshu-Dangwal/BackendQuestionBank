const express = require("express");
const router = express.Router();
const { explanationController } = require("../controller/explanationsController");

router.post("/", explanationController);

module.exports = router;