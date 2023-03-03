const logger = require("../logger");
const db = require("./pgp");
const User = require("../classes/User");

const mapUserDbToClass = async user => {
	user.displayName = user.display_name;
	delete user.display_name;

	try {
		/** @type {string} The guide ids */
		const guideAccess = await db.any(
			"SELECT * FROM guide_access WHERE user_id = $1",
			[user.id]
		);

		// Add any guides the user owns to the list
		/** @type {string[]} The guide ids */
		const ownedGuides = (
			await db.any("SELECT (id) FROM guides WHERE owner_id = $1", [
				user.id,
			])
		).map(guide => guide.id);

		user.guides = [...guideAccess, ...ownedGuides];

		logger.trace("Mapped user db to class");

		return new User(user);
	} catch (err) {
		logger.error("Error mapping user db to class:", err);
		return null;
	}
};

const users = {
	/**
	 * Gets a user from the database.
	 * @param {string} id The UUID of the user to get. If null, an error will be thrown.
	 * @returns {Promise<User?>} The user, or null if not found.
	 */
	async get(id) {
		if (id == null)
			return logger.error("Attempted to get user with null id");

		try {
			const user = await db.oneOrNone(
				`SELECT * FROM users WHERE id = $1`,
				[id]
			);

			if (user == null) {
				logger.debug(`User with id ${id} not found`);
				return null;
			}

			logger.trace(`User with id ${id} found`);

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
			const user = await db.oneOrNone(
				`SELECT id FROM users WHERE display_name = $1`,
				[displayName]
			);

			if (user == null)
				return logger.debug(`User "${displayName}" not found`);

			logger.trace(`User "${displayName}" found: ${user.id}`);

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
		const user = await db.oneOrNone(
			"SELECT * FROM users WHERE display_name = $1",
			[displayName]
		);
		logger.trace("Checking if display name is used");
		return user != null;
	},

	/**
	 * Adds a user to the database.
	 * @param {User} user The user to add.
	 * @returns {Promise<boolean>} True if successful, false if not.
	 */
	async add(user) {
		try {
			await db.none(
				"INSERT INTO users (id, password, display_name) VALUES ($1, $2, $3)",
				[user.id, user.password, user.displayName]
			);
			logger.trace("Added user to database");
			return true;
		} catch (err) {
			logger.error("Error adding user to database:", err);
			return false;
		}
	},
};

module.exports = users;
