const logger = require("../../../logger");
const pong = data => {
	logger.trace("Pong", data);
};
module.exports = pong;
