const express = require("express");
const router = express.Router();

router.get("/:id", require("./user"));
router.get("/id/:displayName", require("./id"));

module.exports = router;
