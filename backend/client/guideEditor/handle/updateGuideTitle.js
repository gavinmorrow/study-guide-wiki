const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");

/**
 * Updates the guide title.
 * @param {object} data The message data.
 * @param {string} data.title The new guide title.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const updateGuideTitle = (data, userSession, session) => {
	logger.trace("Updating guide title", data);

	// TODO: update guide title
};
module.exports = updateGuideTitle;
