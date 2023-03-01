const express = require("express");
const router = express.Router();

const db = require("../../db/db");

router.get("/", async (req, res) => {
	// Get user
	const user = await db.users.get(req.userId);
	if (user == null) {
		return res.sendStatus(401);
	}

	// Resolve guides
	const guides = await Promise.all(
		user.guides.map(async guideId => await db.guides.get(guideId))
	);

	// Render dashboard
	res.render("dashboard", {
		title: "Dashboard | Studypedia",
		user,
		guides,
		resourceName: "dashboard",
	});
});

module.exports = router;
