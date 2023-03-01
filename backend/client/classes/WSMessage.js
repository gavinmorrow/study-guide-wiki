/**
 * @typedef {string} WSMessageType
 * @enum {WSMessageType}
 * @property {WSMessageType} ERROR
 */

class WSMessage {
	static get types() {
		return {
			ERROR: "error",
		};
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
