const express = require("express")
const router = express.Router();

const { checkSession } = require("../controller/sesionController")

router.get("/", checkSession);

module.exports = router;