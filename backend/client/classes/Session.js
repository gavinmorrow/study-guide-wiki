const logger = require("../../logger");

class Session {
	/**
	 * The guide that this session is for.
	 * @type {import("../../classes/Guide")}
	 */
	guide;

	/**
	 * The users in this session.
	 * @type {{id: string, ws: any}[]} The users' UUIDs and websockets.
	 */
	users = [];

	/**
	 * The locks (on paragraphs) that users have obtained.
	 * @type {object[]} The paragraph and user UUIDs.
	 * @property {string} paragraphId The paragraph UUID.
	 * @property {string} userId The user UUID.
	 */
	locks = [];

	constructor(guide) {
		this.guide = guide;
	}

	connectUser(userId, ws) {
		logger.trace(`User ${userId} connected to guide ${ws.guideId}`);
		this.users.push({ id: userId, ws });
	}

	/**
	 * Broadcasts a message to all users in this session.
	 * @param {import("./WSMessage")} msg The message to broadcast.
	 */
	broadcast(msg) {
		logger.trace(
			`Broadcasting message to ${this.users.length} users in guide ${this.guide.id}:`,
			msg
		);
		this.users.forEach(({ ws }) => {
			logger.trace(`Sending message to user ${ws.userId} in guide ${ws.guideId}.`);
			ws.send(JSON.stringify(msg));
		});
	}
}

module.exports = Session;
