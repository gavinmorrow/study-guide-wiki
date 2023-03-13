const logger = require("../../../logger");
const unlockParagraph = (ws, data) => {
	logger.trace("Unlocking paragraph for user", ws.userId);

	ws.session.locks = ws.session.locks.filter(lock => lock.userId !== ws.userId);
};
module.exports = unlockParagraph;
