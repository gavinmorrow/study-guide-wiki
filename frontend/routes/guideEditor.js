const express = require("express");
const router = express.Router();

const db = require("../../api/db/db");

router.get("/:id", async (req, res) => {
	// Get guide
	const guide = await db.guides.get(req.params.id);
	if (guide == null) {
		return res.sendStatus(404);
	}

	// Render
	res.render("guideEditor", {
		title: `${guide.title} | Studypedia`,
		guide,
		resourceName: "guideEditor",
	});
});

// Websocket api
router.ws("/:id", async (ws, req) => {
	logger.mark(`Websocket editor connected to guide ${req.params.id}`);
	ws.on("message", msg => {
		if (msg.type == null)
			ws.send({
				type: "error",
				message: "Invalid message type",
			});

		logger.info("Message from the client:", msg);
	});
});

module.exports = router;
