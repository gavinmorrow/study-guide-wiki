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
	 * The description of the guide. Deafults to an empty string.
	 * @type {string}
	 */
	get description() {
		return this.#description;
	}
	#description = "";

	/**
	 * The author of the guide's UUID.
	 * @type {uuid}
	 */
	get authorId() {
		return this.#authorId;
	}
	#authorId;

	/**
	 * The grade of the guide.
	 * @type {number}
	 */
	get grade() {
		return this.#grade;
	}
	#grade;

	/**
	 * The subject of the guide.
	 * @type {string}
	 */
	get subject() {
		return this.#subject;
	}
	#subject;

	/**
	 * The teacher of the guide.
	 * @type {string}
	 */
	get teacher() {
		return this.#teacher;
	}
	#teacher;

	/**
	 * The year of the guide.
	 * @type {number}
	 */
	get year() {
		return this.#year;
	}
	#year;

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
	 * @param {string} description The description of the guide.
	 * @param {uuid} authorId The author of the guide's UUID.
	 * @param {number} grade The grade of the guide.
	 * @param {string} subject The subject of the guide.
	 * @param {string} teacher The teacher of the guide.
	 * @param {number} year The year of the guide.
	 * @param {[{ id: string, permissionLevel: PermissionLevel }]} [people=[]] The people who have access to the guide, and their permission level. This should *not* include the author. Defaults to an empty array.
	 */
	constructor(
		id,
		title,
		description,
		authorId,
		grade,
		subject,
		teacher,
		year,
		people = []
	) {
		this.#id = id;
		this.#title = title;
		this.#description = description;
		this.#authorId = authorId;
		this.#grade = grade;
		this.#subject = subject;
		this.#teacher = teacher;
		this.#year = year;
		this.#people = people;
	}

	/**
	 * Returns a JSON representation of the guide.
	 * @returns { {
	 * 	id: string,
	 * 	title: string,
	 * 	description: string,
	 * 	authorId: string,
	 * 	grade: number,
	 * 	subject: string,
	 * 	teacher: string,
	 * 	year: string,
	 * 	people: [{ id: string, permissionLevel: PermissionLevel }]
	 * } } The JSON representation of the guide.
	 */
	toJSON() {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			authorId: this.authorId,
			grade: this.grade,
			subject: this.subject,
			teacher: this.teacher,
			year: this.year,
			people: this.people,
		};
	}

	/**
	 * Converts an object to a guide class.
	 * @param { {
	 * 	id: string,
	 * 	title: string,
	 * 	description: string,
	 * 	authorId: string,
	 * 	grade: number,
	 * 	subject: string,
	 * 	teacher: string,
	 * 	year: string,
	 * 	people: [{ id: string, permissionLevel: PermissionLevel }]
	 * } } guide The guide object to convert.
	 * @returns {Guide}
	 */
	static fromObject(guide) {
		return new Guide(
			guide.id,
			guide.title,
			guide.description,
			guide.authorId,
			guide.grade,
			guide.subject,
			guide.teacher,
			guide.year,
			guide.people
		);
	}
}
