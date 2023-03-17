const logger = require("../../../logger");
const deleteSection = (data, userSession, session) => {
	logger.trace("Deleting section", data);

	// TODO: delete section from database
};
module.exports = deleteSection;
