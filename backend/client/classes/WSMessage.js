/**
 * @typedef {string} WSMessageType
 * @enum {WSMessageType}
 * @property {WSMessageType} PING
 * @property {WSMessageType} PONG
 *
 * @property {WSMessageType} UPDATE
 *
 * @property {WSMessageType} LOCK_PARAGRAPH
 * @property {WSMessageType} UNLOCK_PARAGRAPH
 *
 * @property {WSMessageType} ERROR
 */

/**
 * @typedef {string} UpdateType
 * @enum {UpdateType}
 *
 * @property {UpdateType} UPDATE_GUIDE_TITLE
 *
 * @property {UpdateType} NEW_SECTION
 * @property {UpdateType} UPDATE_SECTION_TITLE
 * @property {UpdateType} DELETE_SECTION
 *
 * @property {UpdateType} NEW_PARAGRAPH
 * @property {UpdateType} UPDATE_PARAGRAPH
 * @property {UpdateType} DELETE_PARAGRAPH
 */

/**
 * A message to be sent over the WebSocket connection.
 */
class WSMessage {
	static types = {
		ping: "ping",
		pong: "pong",
		update: {
			updateGuideTitle: "updateGuideTitle",
			newSection: "newSection",
			updateSectionTitle: "updateSectionTitle",
			deleteSection: "deleteSection",
			newParagraph: "newParagraph",
			updateParagraph: "updateParagraph",
			deleteParagraph: "deleteParagraph",
		},
		lockParagraph: "lockParagraph",
		unlockParagraph: "unlockParagraph",
		error: "error",
	};

	/**
	 * Creates a new ping message.
	 * @returns {string}
	 */
	static ping() {
		return new WSMessage(WSMessage.types.ping).toString();
	}

	/**
	 * Creates a new pong message.
	 * @returns {string}
	 */
	static pong() {
		return new WSMessage(WSMessage.types.pong).toString();
	}

	// TODO: maybe make seperate methods for each update type?
	/**
	 * Creates a new update message.
	 * @param {UpdateType} type The type of the update.
	 * @param {any} data The data to send.
	 * @returns {string?} The message, or null if the type is invalid.
	 */
	static update(type, data) {
		type = WSMessage.types.update[type];
		if (type == null) {
			logger.error(`Invalid update type: ${type}`);
			return null;
		}

		return new WSMessage(type, data).toString();
	}

	/**
	 * Creates a new lock paragraph message. This *does not* check if the paragraph is already locked, nor does it actually lock the paragraph.
	 * @param {string} paragraphId The ID of the paragraph to lock.
	 * @param {string} userId The ID of the user who locked the paragraph.
	 * @returns {string}
	 */
	static lockParagraph(paragraphId, userId) {
		return new WSMessage(WSMessage.types.lockParagraph, {
			paragraphId,
			userId,
		}).toString();
	}

	/**
	 * Creates a new unlock paragraph message. This *does not* check if the paragraph is already unlocked, nor does it actually unlock the paragraph.
	 * @param {string} paragraphId The ID of the paragraph to unlock.
	 * @param {string} userId The ID of the user who unlocked the paragraph.
	 * @returns {string}
	 */
	static unlockParagraph(paragraphId, userId) {
		return new WSMessage(WSMessage.types.unlockParagraph, {
			paragraphId,
			userId,
		}).toString();
	}

	/**
	 * Creates a new error message.
	 * @param {string} message The error message.
	 * @param {any} data The data to send.
	 * @returns {string}
	 */
	static error(message, data = null) {
		return new WSMessage(WSMessage.types.error, {
			message,
			data,
		}).toString();
	}

	/**
	 * Creates a new WSMessage.
	 * @param {WSMessageType} type The type of the message.
	 * @param {any} data The data of the message.
	 */
	constructor(type, data = undefined) {
		this.type = type;
		this.data = data;
	}

	/**
	 * The type of the message.
	 * @type {WSMessageType}
	 */
	type;

	/**
	 * The data of the message.
	 * @type {any}
	 */
	data;

	toJSON() {
		return {
			type: this.type,
			data: this.data,
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = WSMessage;
