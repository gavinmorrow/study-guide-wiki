const logger = require("../../../logger");
const deleteParagraph = data => {
	logger.trace("Deleting paragraph", data);

	// TODO: delete paragraph from database
};
module.exports = deleteParagraph;
