const logger = require("../../../logger");
const deleteSection = (ws, data) => {
	logger.trace("Deleting section", data);

	// TODO: delete section from database
};
module.exports = deleteSection;
