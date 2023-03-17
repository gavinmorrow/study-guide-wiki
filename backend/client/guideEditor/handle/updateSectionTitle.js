const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");

/**
 * Updates the section title.
 * @param {object} data The message data.
 * @param {string} data.newValue The new section title.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const updateSectionTitle = (data, userSession, session) => {
	logger.trace("Updating section title", data);

	// TODO: update section title
};
module.exports = updateSectionTitle;
