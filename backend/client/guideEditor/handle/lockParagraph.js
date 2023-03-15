const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");
const WSMessage = require("../../classes/WSMessage");

/**
 * Locks a paragraph for a user.
 * @param {WebSocket} ws The user's websocket.
 * @param {object} data The data sent by the client.
 * @param {string} data.paragraphId The paragraph UUID.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const lockParagraph = (ws, data, userSession, session) => {
	logger.trace(`Locking paragraph ${data.paragraphId} for user ${userSession.userId}.`);

	if (session.locks.find(lock => lock.token === userSession.token)) {
		logger.warn(
			`Session token ${userSession.token} already has a lock on a paragraph. Ignoring lock request.`
		);
		ws.send(
			WSMessage.error("You already have a lock on a paragraph.", {
				type: "alreadyLocked",
				paragraphId: data.paragraphId,
			})
		);
		return;
	}

	session.locks.push({ token: userSession.token, paragraphId: data.paragraphId });
};
module.exports = lockParagraph;
