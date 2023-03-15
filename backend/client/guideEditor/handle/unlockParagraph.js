const logger = require("../../../logger");
const unlockParagraph = (ws, data, session) => {
	logger.trace("Unlocking paragraph for user", ws.userId);

	session.locks = session.locks.filter(lock => lock.userId !== ws.userId);
};
module.exports = unlockParagraph;
