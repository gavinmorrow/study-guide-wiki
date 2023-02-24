/**
 * @typedef {object} UserData
 * @property {string} id The id (UUID) of the user.
 * @property {string} password The password of the user. This is hashed with bcrypt.
 * @property {string} displayName The user's display name.
 * @property {Array<string>} guides The ids of the guides the user is a part of.
 */

/**
 * A user class. It *does not* sync with the database.
 */
class User {
	/**
	 * All data for this user.
	 * @type {UserData}
	 */
	#data = {};

	/**
	 * The id (UUID) of the user.
	 * @type {string}
	 */
	get id() {
		return this.#data.id;
	}

	/**
	 * The password of the user. This is hashed with bcrypt.
	 * @type {string}
	 */
	get password() {
		return this.#data.password;
	}

	/**
	 * The user's display name.
	 *
	 * This is unqiue, but NOT what should be used to identify them,
	 * as it can change at any time.
	 *
	 * @type {string}
	 */
	get displayName() {
		return this.#data.displayName;
	}

	/**
	 * The ids of the guides the user is a part of.
	 * @type {Array<string>}
	 */
	get guides() {
		return this.#data.guides;
	}

	/** @param {UserData} data The data to use for this user. */
	constructor(data) {
		this.#data = data;
	}

	/**
	 * Returns a JSON representation of the user.
	 * @returns {UserData} The JSON representation of the user.
	 */
	toJSON() {
		return this.#data;
	}
}

module.exports = User;
