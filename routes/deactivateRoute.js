const express = require("express")
const router = express.Router();

const { deactivateController } = require("../controller/deactivateController");

router.post("/", deactivateController);

module.exports = router;