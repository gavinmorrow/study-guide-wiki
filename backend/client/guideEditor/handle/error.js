const logger = require("../../../logger");
const error = (ws, data, session) => {
	logger.error("Error:", data);

	// TODO: handle error
};
module.exports = error;
