const logger = require("../../../logger");
const deleteSection = data => {
	logger.trace("Deleting section", data);

	// TODO: delete section from database
};
module.exports = deleteSection;
