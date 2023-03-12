class Session {
	/**
	 * The users in this session.
	 * @type {string[]} The users UUID's.
	 */
	users = [];

	/**
	 * The locks (on paragraphs) that users have obtained.
	 * @type {string[]} The paragraph UUIDs.
	 */
	locks = [];

	connectUser(userId) {
		this.users.push(userId);
	}
}

module.exports = Session;
