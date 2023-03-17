const db = require("../../../db/db");
const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");
const WSMessage = require("../../classes/WSMessage");

/**
 * Updates a paragraph.
 * @param {object} data The message data.
 * @param {string} data.newValue The new paragraph content.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const updateParagraph = async (data, userSession, session) => {
	logger.trace("Updating paragraph", data);

	// Current paragraph
	const paragraphId = session.locks.find(lock => lock.token === userSession.token)?.paragraphId;

	if (paragraphId == null) {
		logger.warn("Token", userSession.token, "tried to update a paragraph without a lock");
		userSession.ws.send(
			WSMessage.error("You don't have a lock on this paragraph.", {
				type: "noLock",
				paragraphId: paragraphId,
			})
		);
		return;
	}

	const success = await db.guides.updateParagraphContent(paragraphId, data.newValue);
	if (!success) {
		logger.warn("Paragraph", paragraphId, "could not be updated");
		userSession.ws.send(
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
