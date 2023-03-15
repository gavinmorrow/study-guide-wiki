const logger = require("../../../logger");
const credentialsAreValid = require("../../authentication/credentialsAreValid");
const generateAccessToken = require("../../authentication/generateAccessToken");
const generateRefreshToken = require("../../authentication/generateRefreshToken");
const setAuthCookies = require("./setAuthCookies");

/** A route to login a user and return a JWT. */
const login = async (req, res) => {
	// Get the username and password from the request body
	const { id, password } = req.body;
	if (!id || !password) {
		logger.debug("Id and password not supplied to login route.");
		return res.status(400).send("Id and password required");
	}

	// Check if the id and password are correct
	if (!(await credentialsAreValid(id, password))) {
		logger.trace("Invalid credentials supplied to login route.");
		return res.status(401).send("Invalid credentials");
	}

	// Generate an access token with the id as the payload
	const accessToken = generateAccessToken(id);

	// Generate a refresh token with the id as the payload
	const refreshToken = generateRefreshToken(id);

	// Set the cookie
	setAuthCookies(res, accessToken, refreshToken);

	logger.trace(`User ${id} logged in.`);

	res.sendStatus(204);
};

module.exports = login;
