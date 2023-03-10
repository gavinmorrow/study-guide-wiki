const logger = require("../../../logger");
const pong = () => {
	logger.trace("Got pong from client");
};
module.exports = pong;
