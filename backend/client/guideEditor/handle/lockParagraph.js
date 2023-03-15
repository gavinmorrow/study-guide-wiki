const logger = require("../../../logger");
const WSMessage = require("../../classes/WSMessage");
	logger.trace("Locking paragraph", data);
const lockParagraph = (ws, data, session) => {

	if (ws.session.locks.find(lock => lock.userId === ws.userId)) {
		logger.warn("User", ws.userId, "tried to lock a paragraph while already having a lock");
		ws.send(
			WSMessage.error("You already have a lock on a paragraph.", {
				type: "alreadyLocked",
				paragraphId: data.paragraphId,
			})
		);
		return;
	}

	ws.session.locks.push({ userId: ws.userId, paragraphId: data.paragraphId });
};
module.exports = lockParagraph;
