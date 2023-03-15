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
	 * The guide id that this session is for.
	 * @type {string}
	 */
	guideId;

	/**
	 * The user's websocket.
	 * @type {WebSocket}
	 */
	ws;

	constructor(token, userId, guideId, ws) {
		this.token = token;
		this.userId = userId;
		this.guideId = guideId;
		this.ws = ws;
	}
}

module.exports = UserSession;
