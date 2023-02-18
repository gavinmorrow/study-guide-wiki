const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const mapUserDbToClass = async user => {
	user.displayName = user.display_name;
	delete user.display_name;

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

	return User.fromObject(user);
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
			if (id == null) throw new Error("id cannot be null");

			try {
				const user = await db.raw.oneOrNone(
					`SELECT * FROM users WHERE id = $1`,
					[id]
				);

				if (user == null) return null;

				return await mapUserDbToClass(user);
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

			return await mapGuideDbToClass(guide);
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
