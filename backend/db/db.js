const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const logger = require("../logger");

const mapUserDbToClass = async user => {
	user.displayName = user.display_name;
	delete user.display_name;

	try {
		const guideAccess = await db.raw.any(
			"SELECT * FROM guide_access WHERE user_id = $1",
			[user.id]
		);

		// Collapse the array of promises into an array of guides.
		/** @type {Guide[]} */
		const guides = await Promise.all(
			// Create and array of promises, each of which resolves to a guide
			// or rejects with an error (if the guide is not found).
			guideAccess.map(id => {
				return new Promise((resolve, reject) => {
					db.guides.get(id).then(guide => {
						if (guide == null) reject("Guide not found");
						else resolve(guide);
					});
				});
			})
		);

		// Add any guides the user owns to the list
		const ownedGuidesRaw = await db.raw.any(
			"SELECT * FROM guides WHERE owner_id = $1",
			[user.id]
		);
		const ownedGuides = await Promise.all(
			ownedGuidesRaw.map(guide => mapGuideDbToClass(guide))
		);
		guides.push(...ownedGuides);
		user.guides = guides;

		logger.mark("Mapped user db to class");

		return User.fromObject(user);
	} catch (err) {
		logger.error("Error mapping user db to class:", err);
		return null;
	}
};

const mapGuideDbToClass = async guide => {
	guide.authorId = guide.owner_id;
	delete guide.owner_id;

	// FIXME: move get ppl logic to here

	return Guide.fromObject(guide);
};

const db = {
	/** Gets the raw database (pg-promise) object. */
	get raw() {
		return database;
	},

	users: {
		/**
		 * Gets a user from the database.
		 * @param {string} id The UUID of the user to get. If null, an error will be thrown.
		 * @returns {Promise<User?>} The user, or null if not found.
		 */
		async get(id) {
			if (id == null)
				return logger.error("Attempted to get user with null id");

			try {
				const user = await db.raw.oneOrNone(
					`SELECT * FROM users WHERE id = $1`,
					[id]
				);

				if (user == null) {
					logger.trace(`User with id ${id} not found`);
					return null;
				}

				logger.mark(`User with id ${id} found`);

				return await mapUserDbToClass(user);
			} catch (err) {
				logger.error("Error getting user:", err);
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
				return logger.error("displayName cannot be null");

			try {
				const user = await db.raw.oneOrNone(
					`SELECT id FROM users WHERE display_name = $1`,
					[displayName]
				);

				if (user == null)
					return logger.trace(`User "${displayName}" not found`);

				logger.mark(`User "${displayName}" found: ${user.id}`);

				return user.id;
			} catch (err) {
				logger.error(`Error getting id from display name:`, err);
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
			logger.mark("Checking if display name is used");
			return user != null;
		},

		/**
		 * Adds a user to the database.
		 * @param {User} user The user to add.
		 */
		async add(user) {
			try {
				await db.raw.none(
					"INSERT INTO users (id, password, display_name) VALUES ($1, $2, $3)",
					[user.id, user.password, user.displayName]
				);
				logger.mark("Added user to database");
			} catch (err) {
				logger.error("Error adding user to database:", err);
			}
		},
	},

	guides: {
		/**
		 * Gets a guide from the database.
		 * @param {string} id The UUID of the guide to get. If null, an error will be thrown.
		 * @returns {Promise<Guide?>} The guide, or null if not found.
		 */
		async get(id) {
			if (id == null)
				return logger.error("Attempted to get guide with null id");

			try {
				const guide = await db.raw.oneOrNone(
					`SELECT * FROM guides WHERE id = $1`,
					[id]
				);

				if (guide == null) return null;

				// Map database columns to class properties
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

				logger.mark(`Guide with id ${id} found`);

				return await mapGuideDbToClass(guide);
			} catch (err) {
				logger.error("Error getting guide:", err);
				return null;
			}
		},

		/**
		 * Adds a guide to the database.
		 * @param {Guide} guide The guide to add.
		 */
		async add(guide) {
			try {
				await db.raw.none(
					"INSERT INTO guides (id, title, owner_id) VALUES ($1, $2, $3)",
					[guide.id, guide.title, guide.authorId]
				);

				logger.mark(`Added guide ${guide.id} to database`);

				// Add people to guide
				for (const { id: userId, permissionLevel } of guide.people) {
					await db.raw.none(
						"INSERT INTO guide_access (guide_id, user_id, permission_level) VALUES ($1, $2, $3)",
						[guide.id, userId, permissionLevel.name]
					);
				}

				logger.mark(`Added people to guide ${guide.id}`);
			} catch (err) {
				logger.error("Error adding guide to database:", err);
			}
		},

		async updateTitle(id, newTitle) {
			try {
				await db.raw.none(
					"UPDATE guides SET title = $1 WHERE id = $2",
					[newTitle, id]
				);

				logger.mark(`Updated title of guide ${id} to ${newTitle}`);
				return true;
			} catch (err) {
				logger.error("Error updating guide:", err);
				return false;
			}
		},

		/**
		 * Deletes a guide from the database.
		 * @param {string} id The ID of the guide to delete.
		 */
		async delete(id) {
			// Ensure guide exists
			const guide = await db.guides.get(id);
			if (guide == null) return logger.mark(`Guide ${id} not found`);

			try {
				// Delete guide
				// Because of the foreign key constraint,
				// this will also delete all guide_access rows.
				await db.raw.none("DELETE FROM guides WHERE id = $1", [id]);
				logger.mark(`Deleted guide ${id}`);
			} catch (err) {
				logger.error("Error deleting guide:", err);
			}
		},
	},
};

module.exports = db;
