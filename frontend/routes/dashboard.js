const express = require("express");
const router = express.Router();

const db = require("../../backend/db/db");

router.get("/", async (req, res) => {
	// Get user
	const user = await db.users.get(req.userId);
	if (user == null) {
		return res.sendStatus(401);
	}

	// Render dashboard
	res.render("dashboard", {
		title: "Dashboard | Studypedia",
		user,
		resourceName: "dashboard",
	});
});

module.exports = router;
