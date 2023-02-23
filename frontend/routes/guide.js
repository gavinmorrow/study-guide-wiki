const express = require("express");
const router = express.Router();

const db = require("../../backend/db/db");

router.get("/:id", async (req, res) => {
	// Get guide
	const guide = await db.guides.get(req.params.id);
	if (guide == null) {
		return res.sendStatus(404);
	}

	// Render
	res.render("guide", {
		title: `${guide.title} | Studypedia`,
		guide,
		resourceName: "guide",
	});
});

module.exports = router;
