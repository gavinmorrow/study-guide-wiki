/**
 * @typedef {string} WSMessageType
 * @enum {WSMessageType}
 * @property {WSMessageType} PING
 * @property {WSMessageType} PONG
 * @property {WSMessageType} UPDATE
 * @property {WSMessageType} ERROR
 */

/**
 * A message to be sent over the WebSocket connection.
 */
class WSMessage {
	static types = {
		ping: "ping",
		pong: "pong",
		update: "update",
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

	/**
	 * Creates a new update message.
	 * @param {any} data The data to send.
	 * @returns {string}
	 */
	static update(data) {
		return new WSMessage(WSMessage.types.update, data).toString();
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
