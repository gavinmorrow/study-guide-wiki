const logger = require("../../../logger");
const WSMessage = require("../../classes/WSMessage");
const updateParagraph = (ws, data) => {
	logger.trace("Updating paragraph", data);

	// Current user
	const user = ws.session.user;

	// Current paragraph
	const paragraphId = ws.session.locks.find(lock => lock.userId === ws.userId)?.paragraphId;

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

	logger.info("Paragraph ID:", paragraphId);
};
module.exports = updateParagraph;
