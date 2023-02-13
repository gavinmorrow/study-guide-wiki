const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const mapUserDbToClass = user => {
	user.displayName = user.display_name;
	delete user.display_name;
	return User.fromObject(user);
};

const mapGuideDbToClass = guide => {
	guide.authorId = guide.owner_id;
	delete guide.owner_id;
	return Guide.fromObject(guide);
};

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
			return users.map(mapUserDbToClass);
		},

		/**
		 * Gets a user from the database.
		 * @param {string} id The UUID of the user to get. If null, an error will be thrown.
		 * @returns {Promise<User?>} The user, or null if not found.
		 */
		async get(id) {
			if (id == null) throw new Error("id cannot be null");

			try {
				const user = await db.raw.oneOrNone(
					`SELECT * FROM users WHERE id = $1`,
					[id]
				);

				if (user == null) return null;

				return mapUserDbToClass(user);
			} catch (err) {
				console.error(err);
				return null;
			}
		},

		/**
		 * Gets a user's id from the database by their display name.
		 * @param {string} displayName The display name of the user to get. If null, an error will be thrown.
		 * @returns {Promise<string?>} The user's id, or null if not found.
		 */
		async getId(displayName) {
			if (displayName == null)
				throw new Error("displayName cannot be null");

			try {
				const user = await db.raw.oneOrNone(
					`SELECT id FROM users WHERE display_name = $1`,
					[displayName]
				);

				if (user == null) return null;

				return user.id;
			} catch (err) {
				console.error(err);
				return null;
			}
		},

		/**
		 * Checks if a display name is used.
		 * @param {string} displayName The display name to check.
		 * @returns {Promise<boolean>}
		 */
		async displayNameIsUsed(displayName) {
			const user = await db.raw.oneOrNone(
				"SELECT * FROM users WHERE display_name = $1",
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
				"INSERT INTO users (id, password, display_name) VALUES ($1, $2, $3)",
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
			return guides.map(mapGuideDbToClass);
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

			// Map database columns to class properties
			guide.displayName = guide.display_name;
			guide.authorId = guide.owner_id;

			// Fetch people who have access to the guide
			const people = await db.raw.any(
				"SELECT user_id, permission_level FROM guide_access WHERE guide_id = $1",
				[id]
			);

			// Add people to guide object
			guide.people = people.map(({ user_id, permission_level }) => ({
				id: user_id,
				permissionLevel: permission_level,
			}));

			return mapGuideDbToClass(guide);
		},

		/**
		 * Adds a guide to the database.
		 * @param {Guide} guide The guide to add.
		 */
		async add(guide) {
			await db.raw.none(
				"INSERT INTO guides (id, title, description, owner_id, grade, subject, teacher, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
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
					"INSERT INTO guide_access (guide_id, user_id, permission_level) VALUES ($1, $2, $3)",
					[guide.id, userId, permissionLevel.name]
				);
			}
		},

		/**
		 * Deletes a guide from the database.
		 * @param {string} id The ID of the guide to delete.
		 */
		async delete(id) {
			// Ensure guide exists
			const guide = await db.guides.get(id);
			if (guide == null) return;

			// Delete guide
			// Because of the foreign key constraint,
			// this will also delete all guide_access rows.
			await db.raw.none("DELETE FROM guides WHERE id = $1", [id]);
		},
	},
};

module.exports = db;
