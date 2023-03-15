const logger = require("../../../logger");
const newParagraph = (ws, data, session) => {
	logger.trace("New paragraph", data);

	// TODO: create new paragraph in database
};
module.exports = newParagraph;
