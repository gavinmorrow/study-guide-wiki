const logger = require("../logger");
const db = require("./pgp");
const Guide = require("../classes/Guide");
const GuideSection = require("../classes/GuideSection");

const guides = {
	/**
	 * Gets a guide from the database.
	 * @param {string} id The UUID of the guide to get. If null, an error will be thrown.
	 * @returns {Promise<Guide?>} The guide, or null if not found.
	 */
	async get(id) {
		if (id == null) {
			logger.error("Attempted to get guide with null id");
			return null;
		}

		try {
			logger.trace("Getting guide with id", id);

			const [[guide], people, sections, paragraphsData] = await db.multi(
				"SELECT * FROM guides WHERE id = $1; SELECT user_id, permission_level FROM guide_access WHERE guide_id = $1; SELECT id, title FROM guide_sections WHERE guide_id = $1; SELECT section_id, paragraph_id, content FROM guide_section_paragraphs WHERE guide_id = $1",
				[id]
			);

			logger.debug("Paragraphs:", paragraphsData);

			if (guide == null) {
				logger.debug(`Guide with id ${id} not found`);
				return null;
			}

			guide.people = people.map(({ user_id, permission_level }) => ({
				id: user_id,
				permissionLevel: permission_level,
			}));

			guide.sections = sections.map(
				({ id, title, paragraphs }) =>
					new GuideSection({
						guideId: id,
						id,
						title,
						paragraphs: paragraphs.map(paragraph => JSON.parse(paragraph)), // FIXME: (FATAL) This is not how paragraphs are stored now
					})
			);
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
			await db.tx(async t => {
				await t.none("INSERT INTO guides (id, title, owner_id) VALUES ($1, $2, $3)", [
					guide.id,
					guide.title,
					guide.authorId,
				]);

				logger.trace(`Added guide ${guide.id} to database`);

				// Add people to guide
				await this.addPeople(guide.id, guide.people, t);

				// Create default section if none exist
				if (guide.sections.length === 0) {
					logger.trace(`No sections found in guide ${guide.id}, adding default section.`);
					guide.sections.push(
						new GuideSection({
							guideId: guide.id,
							id: crypto.randomUUID(),
							title: "Main",
							paragraphs: [{ id: crypto.randomUUID(), content: "" }],
						})
					);
				}

				// Add sections to guide
				await this.addSections(guide.id, guide.sections, t);
			});
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
	 * Adds a person to a guide.
	 * @param {string} guideId The ID of the guide to add the person to.
	 * @param {string} userId The ID of the user to add to the guide.
	 * @param {import("../classes/PermissionLevel")} permissionLevel The permission level of the user.
	 * @param {import("pg-promise").IDatabase|import("pg-promise").ITask<{}>} t The transaction to use. If not provided, a new transaction will be created.
	 * @returns {Promise<boolean>} Whether the person was added successfully.
	 */
	async addPerson(guideId, userId, permissionLevel, t = db) {
		try {
			await t.none(
				"INSERT INTO guide_access (guide_id, user_id, permission_level) VALUES ($1, $2, $3)",
				[guideId, userId, permissionLevel.name]
			);
			logger.trace(
				`Added user ${userId} to guide ${guideId} with permission level ${permissionLevel.name}`
			);
			return true;
		} catch (err) {
			logger.error(`Error adding user ${userId} to guide ${guideId}: ${err}`);
			return false;
		}
	},

	/**
	 * Adds multiple people to a guide. This must be done in a transaction.
	 * @param {string} guideId The ID of the guide to add the people to.
	 * @param {{ id: string, permissionLevel: import("../classes/PermissionLevel") }[]} users The users to add to the guide.
	 * @param {import("pg-promise").ITask<{}>} t The transaction to use.
	 * @returns {Promise<boolean>} Whether the people were added successfully.
	 */
	async addPeople(guideId, users, t) {
		try {
			const queries = users.map(({ id: userId, permissionLevel }) =>
				this.addPerson(guideId, userId, permissionLevel, t)
			);
			await t.batch(queries);

			logger.trace(`Added ${users.length} people (${users.join()}) to guide ${guideId}`);
			return true;
		} catch (err) {
			logger.error("Error adding people to guide:", err);
			return false;
		}
	},

	/**
	 * Adds a section to a guide.
	 * @param {string} guideId The ID of the guide to add the section to.
	 * @param {GuideSection} section The section to add.
	 * @param {import("pg-promise").ITask<{}>} t The transaction to use.
	 * @returns {Promise<boolean>} Whether the section was added successfully.
	 */
	async addSection(guideId, section, t) {
		try {
			const { id, title, paragraphs } = section;
			await t.none("INSERT INTO guide_sections (id, guide_id, title) VALUES ($1, $2, $3)", [
				id,
				guideId,
				title,
			]);

			// Add paragraphs to section
			await this.addParagraphs(guideId, id, paragraphs, t);

			logger.trace(`Added section ${title} to guide ${guideId}`);
			return true;
		} catch (err) {
			logger.error("Error adding section to guide:", err);
			return false;
		}
	},

	/**
	 * Adds multiple sections to a guide. This must be done in a transaction.
	 * @param {string} guideId The ID of the guide to add the sections to.
	 * @param {GuideSection[]} sections The sections to add to the guide.
	 * @param {import("pg-promise").ITask<{}>} t The transaction to use.
	 * @returns {Promise<boolean>} Whether the sections were added successfully.
	 */
	async addSections(guideId, sections, t) {
		try {
			const queries = sections.map(section => this.addSection(guideId, section, t));
			await t.batch(queries);

			logger.trace(`Added ${sections.length} sections to guide ${guideId}`);
			return true;
		} catch (err) {
			logger.error("Error adding sections to guide:", err);
			return false;
		}
	},

	/**
	 * Adds a paragraph to a guide section.
	 * @param {string} guideId The ID of the guide to add the paragraph to.
	 * @param {string} sectionId The ID of the section to add the paragraph to.
	 * @param {string} paragraphId The ID of the paragraph to add.
	 * @param {string} content The content of the paragraph.
	 * @param {import("pg-promise").IDatabase|import("pg-promise").ITask<{}>} t The transaction to use. If not provided, a new transaction will be created.
	 * @returns {Promise<boolean>} Whether the paragraph was added successfully.
	 */
	async addParagraph(guideId, sectionId, paragraphId, content, t = db) {
		try {
			await t.none(
				"INSERT INTO guide_section_paragraphs (id, guide_id, section_id, content) VALUES ($1, $2, $3, $4)",
				[paragraphId, guideId, sectionId, content]
			);
			logger.trace(`Added paragraph to section ${sectionId} in guide ${guideId}.`);
			return true;
		} catch (err) {
			logger.error("Error adding paragraph to guide:", err);
			return false;
		}
	},

	/**
	 * Adds multiple paragraphs to a guide section.
	 * @param {string} guideId The ID of the guide to add the paragraphs to.
	 * @param {string} sectionId The ID of the section to add the paragraphs to.
	 * @param {object[]} paragraphs The paragraphs to add.
	 * @param {string} paragraphs[].id The ID of the paragraph to add.
	 * @param {string} paragraphs[].content The content of the paragraph.
	 * @param {import("pg-promise").ITask<{}>} t The transaction to use.
	 */
	async addParagraphs(guideId, sectionId, paragraphs, t) {
		try {
			const queries = paragraphs.map(({ id, content }) =>
				this.addParagraph(guideId, sectionId, id, content, t)
			);
			await t.batch(queries);

			logger.trace(
				`Added ${paragraphs.length} paragraphs to section ${sectionId} in guide ${guideId}.`
			);
			return true;
		} catch (err) {
			logger.error("Error adding paragraphs to guide:", err);
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
		const guide = await this.get(id);
		if (guide == null) {
			logger.trace(`Guide ${id} not found`);
			return false;
		}

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
