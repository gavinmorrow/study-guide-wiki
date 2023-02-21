// TODO: Refactor (maybe make a private data property [object] and read from that instead of separate properties? This would make it easier to add new properties, and make encoding and decoding to/from JSON easier.)

/**
 * A guide class. It *does not* sync with the database.
 */
class Guide {
	/**
	 * The id (UUID) of the guide.
	 * @type {string}
	 */
	get id() {
		return this.#id;
	}
	#id;

	/**
	 * The title of the guide.
	 * @type {string}
	 */
	get title() {
		return this.#title;
	}
	#title;

	/**
	 * The author of the guide's UUID.
	 * @type {uuid}
	 */
	get authorId() {
		return this.#authorId;
	}
	#authorId;

	/**
	 * The people who have access to the guide, and their permission level.
	 *
	 * This should *not* include the author.
	 *
	 * @type {[{ id: string, permissionLevel: PermissionLevel }]}
	 */
	get people() {
		return this.#people;
	}
	#people = [];

	/**
	 * @param {string} id The id of the guide. This is a UUID.
	 * @param {string} title The title of the guide.
	 * @param {uuid} authorId The author of the guide's UUID.
	 * @param {[{ id: string, permissionLevel: PermissionLevel }]} [people=[]] The people who have access to the guide, and their permission level. This should *not* include the author. Defaults to an empty array.
	 */
	constructor(id, title, authorId, people = []) {
		this.#id = id;
		this.#title = title;
		this.#authorId = authorId;
		this.#people = people;
	}

	/**
	 * Returns a JSON representation of the guide.
	 * @returns { {
	 * 	id: string,
	 * 	title: string,
	 * 	authorId: string,
	 * 	people: [{ id: string, permissionLevel: PermissionLevel }]
	 * } } The JSON representation of the guide.
	 */
	toJSON() {
		return {
			id: this.id,
			title: this.title,
			authorId: this.authorId,
			people: this.people,
		};
	}

	/**
	 * Converts an object to a guide class.
	 * @param { {
	 * 	id: string,
	 * 	title: string,
	 * 	authorId: string,
	 * 	people: [{ id: string, permissionLevel: PermissionLevel }]
	 * } } guide The guide object to convert.
	 * @returns {Guide}
	 */
	static fromObject(guide) {
		return new Guide(guide.id, guide.title, guide.authorId, guide.people);
	}
}

module.exports = Guide;
