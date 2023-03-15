const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");

/**
 * Unlocks a paragraph for a user.
 * @param {WebSocket} ws The user's websocket.
 * @param {object} data The message data.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const unlockParagraph = (ws, data, userSession, session) => {
	logger.trace("Unlocking paragraph for session token", userSession.token);

	session.locks = session.locks.filter(lock => lock.token !== userSession.token);
};
module.exports = unlockParagraph;
