const logger = require("../logger");
const db = require("./pgp");
const Guide = require("../classes/Guide");

const guides = {
	/**
	 * Gets a guide from the database.
	 * @param {string} id The UUID of the guide to get. If null, an error will be thrown.
	 * @returns {Promise<Guide?>} The guide, or null if not found.
	 */
	async get(id) {
		if (id == null) return logger.error("Attempted to get guide with null id");

		try {
			logger.trace("Getting guide with id", id);

			const [[guide], people, sections] = await db.multi(
				"SELECT * FROM guides WHERE id = $1; SELECT user_id, permission_level FROM guide_access WHERE guide_id = $1; SELECT title, content FROM guide_sections WHERE guide_id = $1;",
				[id]
			);

			if (guide == null) {
				logger.debug(`Guide with id ${id} not found`);
				return null;
			}

			guide.people = people.map(({ user_id, permission_level }) => ({
				id: user_id,
				permissionLevel: permission_level,
			}));

			guide.sections = sections;
			guide.authorId = guide.owner_id;
			delete guide.owner_id;

			logger.trace(`Guide with id ${id} found`);

			return new Guide(guide);
		} catch (err) {
			logger.error("Error getting guide:", err);
			return null;
		}
	},

	/**
	 * Adds a guide to the database.
	 * @param {Guide} guide The guide to add.
	 * @returns {Promise<boolean>} Whether the guide was added successfully.
	 */
	async add(guide) {
		try {
			await db.none("INSERT INTO guides (id, title, owner_id) VALUES ($1, $2, $3)", [
				guide.id,
				guide.title,
				guide.authorId,
			]);

			logger.trace(`Added guide ${guide.id} to database`);

			// Add people to guide
			for (const { id: userId, permissionLevel } of guide.people) {
				await db.none(
					"INSERT INTO guide_access (guide_id, user_id, permission_level) VALUES ($1, $2, $3)",
					[guide.id, userId, permissionLevel.name]
				);
			}

			logger.trace(`Added people to guide ${guide.id}`);
			return true;
		} catch (err) {
			logger.error("Error adding guide to database:", err);
			return false;
		}
	},

	/**
	 * Updates the title of a guide.
	 * @param {string} id The ID of the guide to update.
	 * @param {string} newTitle The new title of the guide.
	 * @returns {Promise<boolean>} Whether the title was updated successfully.
	 */
	async updateTitle(id, newTitle) {
		try {
			await db.none("UPDATE guides SET title = $1 WHERE id = $2", [newTitle, id]);

			logger.trace(`Updated title of guide ${id} to ${newTitle}`);
			return true;
		} catch (err) {
			logger.error("Error updating guide:", err);
			return false;
		}
	},

	/**
	 * Deletes a guide from the database.
	 * @param {string} id The ID of the guide to delete.
	 * @returns {Promise<boolean>} Whether the guide was deleted successfully.
	 */
	async delete(id) {
		// Ensure guide exists
		const guide = await db.guides.get(id);
		if (guide == null) return logger.trace(`Guide ${id} not found`);

		try {
			// Delete guide
			// Because of the foreign key constraint,
			// this will also delete all guide_access rows.
			await db.none("DELETE FROM guides WHERE id = $1", [id]);
			logger.trace(`Deleted guide ${id}`);
			return true;
		} catch (err) {
			logger.error("Error deleting guide:", err);
			return false;
		}
	},
};

module.exports = guides;
