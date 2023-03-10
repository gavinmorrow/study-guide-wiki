const logger = require("../../../logger");
const error = (ws, data) => {
	logger.error("Error:", data);

	// TODO: handle error
};
module.exports = error;
