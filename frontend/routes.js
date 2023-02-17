const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.render("homepage", { title: "Studypedia" }));
router.get("/signup", (req, res) =>
	res.render("signup", { title: "Signup | Studypedia" })
);
router.get("/login", (req, res) =>
	res.render("login", { title: "Login | Studypedia" })
);
router.get("/dashboard", (req, res) =>
	res.render("dashboard", { title: "Dashboard | Studypedia" })
);
router.use(express.static("./frontend/public"));

module.exports = router;
