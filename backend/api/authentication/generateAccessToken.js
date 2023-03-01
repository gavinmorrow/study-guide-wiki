const logger = require("../../logger");
const jwt = require("jsonwebtoken");

/**
 * Creates a token for a user.
 * @param {string} id The id of the user to generate an access token for.
 * @returns {string} The token.
 */
const generateAccessToken = id => {
	// Ensure that the ACCESS_TOKEN_SECRET environment variable is set
	if (!process.env.ACCESS_TOKEN_SECRET) {
		logger.fatal("ACCESS_TOKEN_SECRET environment variable is not set");
		throw new Error("ACCESS_TOKEN_SECRET environment variable is not set");
	}

	const expiresIn = "15m";
	const secret = process.env.ACCESS_TOKEN_SECRET;

	const token = jwt.sign({ id }, secret, { expiresIn });
	logger.mark(`Generated access token for user ${id}.`);
	return token;
};

module.exports = generateAccessToken;
