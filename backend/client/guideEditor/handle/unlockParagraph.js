const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");
const WSMessage = require("../../classes/WSMessage");

/**
 * Unlocks a paragraph for a user.
 * @param {object} data The message data.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const unlockParagraph = (data, userSession, session) => {
	logger.trace("Unlocking paragraph for session token", userSession.token);

	session.locks = session.locks.filter(lock => lock.token !== userSession.token);

	// broadcast the unlock to all users
	
};
module.exports = unlockParagraph;
