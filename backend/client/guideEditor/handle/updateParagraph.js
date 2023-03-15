const db = require("../../../db/db");
const logger = require("../../../logger");
const WSMessage = require("../../classes/WSMessage");
const updateParagraph = async (ws, data, session) => {
	logger.trace("Updating paragraph", data);

	// Current paragraph
	const paragraphId = session.locks.find(lock => lock.userId === ws.userId)?.paragraphId;

	if (paragraphId == null) {
		logger.warn("User", ws.userId, "tried to update a paragraph without a lock");
		ws.send(
			WSMessage.error("You don't have a lock on this paragraph.", {
				type: "noLock",
				paragraphId: data.paragraphId,
			})
		);
		return;
	}

	const success = await db.guides.updateParagraphContent(paragraphId, data.newValue);
	if (!success) {
		logger.warn("Paragraph", paragraphId, "could not be updated");
		ws.send(
			WSMessage.error("Paragraph could not be updated", {
				type: "paragraphUpdateFailed",
				paragraphId,
			})
		);
	}

	logger.debug("Paragraph", paragraphId, "updated");

	// Broadcast update
	const message = new WSMessage("paragraphUpdated", {
		paragraphId,
		newValue: data.newValue,
	});
	session.broadcast(message);
};
module.exports = updateParagraph;
