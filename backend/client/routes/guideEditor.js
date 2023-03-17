const express = require("express");
const router = express.Router();

const db = require("../../db/db");
const logger = require("../../logger");

const WSMessage = require("../classes/WSMessage");
const Session = require("../classes/Session");
const handleMessage = require("../guideEditor/handleMessage");

/**
 * @type { Object<string, Session> }
 */
const sessions = {};
// @ts-ignore (property ws does exist on the router)
router.ws("/:id", async (ws, req) => {
	const guideId = req.params.id;
	const userId = req.userId;
	logger.info(`User ${userId} connected to guide ${guideId} via websockets.`);

	// Check if session exists
	if (sessions[guideId] == null) {
		// Get guide
		let guide = await db.guides.get(guideId);
		if (guide == null) {
			ws.send(WSMessage.error("Guide not found", guideId));
			logger.debug(`Guide ${guideId} not found`);
			ws.close();
			return;
		}

		// Create session
		logger.trace(`Creating new session for guide ${guideId}`);
		sessions[guideId] = new Session(guide);
	}

	// Connect to session
	const session = sessions[guideId];
	const userSession = session.connectUser(userId, guideId, ws);

	const pingInterval = setInterval(() => {
		ws.send(WSMessage.ping());
	}, 1000 * 60 /* about 1 minute (in milliseconds) */);

	ws.on("message", async msg => {
		try {
			msg = JSON.parse(msg);
		} catch (e) {
			ws.send(WSMessage.error("Invalid message format. Message must be JSON.", msg));
			logger.debug("Invalid message format for websocket message:", msg);
		}

		if (msg.type == null) ws.send(WSMessage.error("Message type not specified", msg));

		await handleMessage(msg, ws, userSession, session);
	});

	ws.on("close", () => {
		logger.trace(`Websocket editor disconnected from guide ${guideId}`);

		clearInterval(pingInterval);
	});
});

router.get("/:id", async (req, res) => {
	// Get guide
	let guide = await db.guides.get(req.params.id);
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

module.exports = router;
