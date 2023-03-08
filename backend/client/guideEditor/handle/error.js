const logger = require("../../../logger");
const error = data => {
	logger.error("Error:", data);
	
	// TODO: handle error
};
module.exports = error;
