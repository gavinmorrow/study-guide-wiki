/**
 * @typedef {string} WSMessageType
 * @enum {WSMessageType}
 * @property {WSMessageType} PING
 * @property {WSMessageType} PONG
 * @property {WSMessageType} UPDATE
 * @property {WSMessageType} ERROR
 */

const types = ["PING", "PONG", "UPDATE", "ERROR"].reduce((acc, type) => {
	acc[type] = Symbol(type);
	return acc;
}, {});

class WSMessage {
	static get types() {
		types;
	}

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	/**
	 * The type of the message.
	 * @type {WSMessageType}
	 */
	type;
}
