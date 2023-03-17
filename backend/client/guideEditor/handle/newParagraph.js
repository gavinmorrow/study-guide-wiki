const logger = require("../../../logger");
const Session = require("../../classes/Session");
const UserSession = require("../../classes/UserSession");

/**
 * Creates a new paragraph.
 * @param {object} data The message data.
 * @param {UserSession} userSession The user's session data.
 * @param {Session} session The session data.
 */
const newParagraph = async (data, userSession, session) => {
	logger.trace("New paragraph", data);

	// TODO: create new paragraph in database
};
module.exports = newParagraph;
