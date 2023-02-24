const logger = require("../logger");
const db = require("./pgp");
const Guide = require("../classes/Guide");

const mapGuideDbToClass = async guide => {
	guide.authorId = guide.owner_id;
	delete guide.owner_id;

	// FIXME: move get ppl logic to here

	return Guide.fromObject(guide);
};

const guides = {
	/**
	 * Gets a guide from the database.
	 * @param {string} id The UUID of the guide to get. If null, an error will be thrown.
	 * @returns {Promise<Guide?>} The guide, or null if not found.
	 */
	async get(id) {
		if (id == null)
			return logger.error("Attempted to get guide with null id");

		try {
			const guide = await db.oneOrNone(
				`SELECT * FROM guides WHERE id = $1`,
				[id]
			);

			if (guide == null) return null;

			// Map database columns to class properties
			guide.authorId = guide.owner_id;

			// Fetch people who have access to the guide
			const people = await db.any(
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
			await db.none(
				"INSERT INTO guides (id, title, owner_id) VALUES ($1, $2, $3)",
				[guide.id, guide.title, guide.authorId]
			);

			logger.mark(`Added guide ${guide.id} to database`);

			// Add people to guide
			for (const { id: userId, permissionLevel } of guide.people) {
				await db.none(
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
			await db.none("UPDATE guides SET title = $1 WHERE id = $2", [
				newTitle,
				id,
			]);

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
			await db.none("DELETE FROM guides WHERE id = $1", [id]);
			logger.mark(`Deleted guide ${id}`);
		} catch (err) {
			logger.error("Error deleting guide:", err);
		}
	},
};

module.exports = guides;
