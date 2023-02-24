/**
 * @typedef {object} PermissionData
 * @property {string} id The id of the user.
 * @property {PermissionLevel} permissionLevel The permission level of the user.
 */

/**
 * @typedef {object} GuideData
 * @property {string} id The id (UUID) of the guide.
 * @property {string} title The title of the guide.
 * @property {uuid} authorId The author of the guide's UUID.
 * @property {GuideSection[]} sections The sections of the guide.
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
	#data = {};

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
	 * @type {GuideSection[]}
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

	/**
	 * @param {string} id The id of the guide. This is a UUID.
	 * @param {string} title The title of the guide.
	 * @param {uuid} authorId The author of the guide's UUID.
	 * @param {GuideSection[]} sections The sections of the guide.
	 * @param {[{ id: string, permissionLevel: PermissionLevel }]} [people=[]] The people who have access to the guide, and their permission level. This should *not* include the author. Defaults to an empty array.
	 */
	constructor(id, title, authorId, sections, people = []) {
		this.#data = { id, title, authorId, sections, people };
	}

	/**
	 * Returns a JSON representation of the guide.
	 * @returns {GuideData} The JSON representation of the guide.
	 */
	toJSON() {
		return this.#data;
	}

	/**
	 * Converts an object to a guide class.
	 * @param {GuideData} guide The guide object to convert.
	 * @returns {Guide}
	 */
	static fromObject(guide) {
		return new Guide(
			guide.id,
			guide.title,
			guide.authorId,
			guide.sections,
			guide.people
		);
	}
}

module.exports = Guide;
