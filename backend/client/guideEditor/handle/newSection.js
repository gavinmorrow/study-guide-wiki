const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");

/**
 * Creates a new section.
 * @param {object} data The data sent by the client.
 * @param {string} data.title The section title.
 * @param {string} data.paragraphId The UUID of the paragraph to insert the section after.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const newSection = (data, userSession, session) => {
	logger.trace("New section", data);

	// TODO: create new section
};
module.exports = newSection;
