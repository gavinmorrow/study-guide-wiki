const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => res.send("Hello World!"));
router.get("/protected", (_req, res) => {
	res.send("You are authenticated!");
});

router.use(require("./auth/auth"));
router.use("/user", require("./user/userApi"));
router.use("/guide", require("./guide/guide"));

module.exports = router;
