const logger = require("../../../logger");
const deleteSection = (ws, data, session) => {
	logger.trace("Deleting section", data);

	// TODO: delete section from database
};
module.exports = deleteSection;
