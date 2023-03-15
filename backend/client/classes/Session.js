const logger = require("../../logger");
const UserSession = require("./UserSession");

class Session {
	/**
	 * The guide that this session is for.
	 * @type {import("../../classes/Guide")}
	 */
	guide;

	/**
	 * The users in this session.
	 * @type {UserSession[]}
	 */
	users = [];

	/**
	 * @typedef {object} Lock
	 * @property {string} paragraphId The paragraph UUID.
	 * @property {string} token The user's session token.
	 */

	/**
	 * The locks (on paragraphs) that users have obtained.
	 * @type {Lock[]}
	 */
	locks = [];

	constructor(guide) {
		this.guide = guide;
	}

	/**
	 * Connects a user to this session.
	 * @param {string} userId The user's UUID.
	 * @param {WebSocket} ws The user's websocket.
	 * @returns {UserSession} The user's session data.
	 */
	connectUser(userId, ws) {
		// create a session token (uuid)
		const token = crypto.randomUUID();

		// create a new user session
		const userSession = new UserSession(token, userId, ws);

		logger.trace(
			`User ${userSession.userId} (session token: ${userSession.token}) connected to guide ${userSession.guideId}`
		);
		this.users.push(userSession);

		return userSession;
	}

	/**
	 * Broadcasts a message to all users in this session.
	 * @param {import("./WSMessage")} msg The message to broadcast.
	 */
	broadcast(msg) {
		logger.trace(
			`Broadcasting message to ${this.users.length} users in guide ${this.guide.id}.`
		);

		this.users.forEach(session => {
			logger.trace(
				`Sending message to user ${session.userId} (session token: ${session.token}) in guide ${session.guideId}.`
			);
			session.ws.send(JSON.stringify(msg));
		});
	}
}

module.exports = Session;
