const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const db = {
	/** Gets the raw database (pg-promise) object. */
	get raw() {
		return database;
	},

	users: {
		/**
		 * Gets all users from the database.
		 * @returns {Promise<User[]>}
		 */
		async getAll() {
			const users = await db.raw.any(`SELECT * FROM users`);
			return users.map(User.fromObject);
		},

		/**
		 * Gets a user from the database.
		 * @param {string} id The UUID of the user to get. If null, an error will be thrown.
		 * @returns {Promise<User?>} The user, or null if not found.
		 */
		async get(id) {
			if (id == null) throw new Error("id cannot be null");

			const user = await db.raw.oneOrNone(
				`SELECT * FROM users WHERE id = $1`,
				[id]
			);

			if (user == null) return null;

			return User.fromObject(user);
		},

		/**
		 * Checks if a display name is used.
		 * @param {string} displayName The display name to check.
		 * @returns {Promise<boolean>}
		 */
		async displayNameIsUsed(displayName) {
			const user = await db.raw.oneOrNone(
				"SELECT * FROM users WHERE displayName = $1",
				[displayName]
			);
			return user != null;
		},

		/**
		 * Adds a user to the database.
		 * @param {User} user The user to add.
		 */
		async add(user) {
			await db.raw.none(
				"INSERT INTO users (id, password, displayName) VALUES ($1, $2, $3)",
				[user.id, user.password, user.displayName]
			);
		},
	},

	guides: {
		/**
		 * Gets all guides from the database.
		 * @returns {Promise<Guide[]>}
		 */
		async getAll() {
			const guides = await db.raw.any(`SELECT * FROM guides`);
			return guides.map(Guide.fromObject);
		},

		/**
		 * Gets a guide from the database.
		 * @type {(id: string) => Promise<Guide?>}
		 */
		async get(id) {
			if (id == null) throw new Error("id cannot be null");

			const guide = await db.raw.oneOrNone(
				`SELECT * FROM guides WHERE id = $1`,
				[id]
			);

			if (guide == null) return null;

			// Fetch people who have access to the guide
			const people = await db.raw.any(
				"SELECT (userId, permissions) FROM guideAccess WHERE guideId = $1",
				[id]
			);

			// Add people to guide object
			guide.people = people.map((userId, permissions) => ({
				id: userId,
				permissionLevel: permissions,
			}));

			return Guide.fromObject(guide);
		},

		/**
		 * Adds a guide to the database.
		 * @param {Guide} guide The guide to add.
		 */
		async add(guide) {
			await db.raw.none(
				"INSERT INTO guides (id, title, description, authorId, grade, subject, teacher, year) = ($1, $2, $3, $4, $5, $6, $7, $8)",
				[
					guide.id,
					guide.title,
					guide.description,
					guide.authorId,
					guide.grade,
					guide.subject,
					guide.teacher,
					guide.year,
				]
			);

			// Add people to guide
			for (const { id: userId, permissionLevel } of guide.people) {
				await db.raw.none(
					"INSERT INTO guideAccess (guideId, userId, permissions) VALUES ($1, $2, $3)",
					[guide.id, userId, permissionLevel.name]
				);
			}
		},
	},
};

module.exports = db;
