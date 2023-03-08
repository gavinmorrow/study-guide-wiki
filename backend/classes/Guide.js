/**
 * @typedef {object} PermissionData
 * @property {string} id The id of the user.
 * @property {import("./PermissionLevel")} permissionLevel The permission level of the user.
 */

/**
 * @typedef {object} GuideData
 * @property {string} id The id (UUID) of the guide.
 * @property {string} title The title of the guide.
 * @property {string} authorId The author of the guide's UUID.
 * @property {import("./GuideSection")[]} sections The sections of the guide.
 * @property {PermissionData[]} people The people who have access to the guide, and their permission level. This should *not* include the author.
 */

/**
 * A guide class. It *does not* sync with the database.
 */
class Guide {
	/**
	 * All data for this guide.
	 * @type {GuideData}
	 */
	#data;

	/**
	 * The id (UUID) of the guide.
	 * @type {string}
	 */
	get id() {
		return this.#data.id;
	}

	/**
	 * The title of the guide.
	 * @type {string}
	 */
	get title() {
		return this.#data.title;
	}

	/**
	 * The author of the guide's UUID.
	 * @type {uuid}
	 */
	get authorId() {
		return this.#data.authorId;
	}

	/**
	 * The sections of the guide.
	 * @type {import("./GuideSection")[]}
	 */
	get sections() {
		return this.#data.sections;
	}

	/**
	 * The people who have access to the guide, and their permission level.
	 *
	 * This should *not* include the author.
	 *
	 * @type {PermissionData[]}
	 */
	get people() {
		return this.#data.people;
	}

	/** @param {GuideData} data The data to use for this guide. */
	constructor(data) {
		this.#data = data;
	}

	/**
	 * Returns a JSON representation of the guide.
	 * @returns {GuideData} The JSON representation of the guide.
	 */
	toJSON() {
		return this.#data;
	}
}

module.exports = Guide;
