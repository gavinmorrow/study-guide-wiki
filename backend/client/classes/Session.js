class Session {
	/**
	 * The guide that this session is for.
	 * @type {import("../../classes/Guide")}
	 */
	guide;

	/**
	 * The users in this session.
	 * @type {string[]} The users UUID's.
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

	connectUser(userId) {
		this.users.push(userId);
	}
}

module.exports = Session;
