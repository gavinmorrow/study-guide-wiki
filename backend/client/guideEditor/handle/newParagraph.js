const logger = require("../../../logger");
const newParagraph = data => {
	logger.trace("New paragraph", data);

	// TODO: create new paragraph in database
};
module.exports = newParagraph;
