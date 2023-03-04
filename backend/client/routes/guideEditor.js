const express = require("express");
const router = express.Router();

const db = require("../../db/db");
const logger = require("../../logger");
const WSMessage = require("../classes/WSMessage");

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

const handleMessage = (msg, ws) => {
	logger.info("Message from the client:", msg);

	switch (msg.type) {
		case "ping":
			ws.send(WSMessage.pong());
			break;

		case "update":
			break;

		case "error":
			break;

		default:
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

router.ws("/:id", (ws, req) => {
	logger.debug(`Websocket editor connected to guide ${req.params.id}`);

	ws.on("message", msg => {
		try {
			msg = JSON.parse(msg);
		} catch (e) {
			ws.send(
				WSMessage.error(
					"Invalid message format. Message must be JSON.",
					msg
				)
			);
			logger.debug("Invalid message format for websocket message:", msg);
		}

		if (msg.type == null)
			ws.send(WSMessage.error("Message type not specified", msg));

		handleMessage(msg, ws);
	});

	ws.on("close", () => {
		logger.info(
			`Websocket editor disconnected from guide ${req.params.id}`
		);
	});

	ws.send("Hi!");
});

module.exports = router;
