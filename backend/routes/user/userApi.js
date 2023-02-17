const express = require("express");
const router = express.Router();

router.get("/", require("./user"));
router.get("/id/:displayName", require("./id"));

module.exports = router;
