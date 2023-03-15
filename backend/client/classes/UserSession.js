/**
 * Represents a user's individual session data.
 *
 * This should be used instead of directly setting properties on the websocket.
 */
class UserSession {
	/**
	 * The user's session token.
	 * @type {string} UUID
	 */
	token;

	/**
	 * The user's ID.
	 * @type {string} UUID
	 */
	userId;

	/**
	 * The user's websocket.
	 * @type {WebSocket}
	 */
	ws;

	constructor(token, userId, ws) {
		this.token = token;
		this.userId = userId;
		this.ws = ws;
	}
}

module.exports = UserSession;
