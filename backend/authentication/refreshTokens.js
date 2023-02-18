const logger = require("../logger");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("./generateAccessToken");
const generateRefreshToken = require("./generateRefreshToken");

// Each refresh token is only valid for one use
// And whenever an old token is used, the entire family of tokens is invalidated
// Each family is represented by a UUID

/** @type {Set<string>} Raw refresh tokens (JWTs) */
let usedTokens = new Set();

/** @type {Set<string>} UUIDs */
let invalidFamilies = new Set();

/**
 * Refreshes an access token.
 * @param {string} refreshToken The refresh token to use.
 * @returns {{accessToken: string, refreshToken: string}?} The new access and refresh tokens. If the refresh token is invalid, null is returned.
 */
const refreshTokens = async refreshToken => {
	// Verify the refresh token
	let id, family;
	try {
		const token = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		id = token.id;
		family = token.family;

		if (id == null || family == null) {
			logger.trace("Invalid refresh token:", token);
			return null;
		}
	} catch (err) {
		if (!(err instanceof jwt.JsonWebTokenError)) {
			throw err;
		}
		logger.trace("Error validating refresh token:", err);

		return null;
	}

	// Check if the refresh token family has been invalidated
	if (invalidFamilies.has(family)) {
		logger.trace(
			"Attempted to refresh a refresh token from an invalid family."
		);
		return null;
	}

	// If the token has been used before, invalidate the entire family
	if (usedTokens.has(refreshToken)) {
		invalidFamilies.add(family);
		logger.trace("Refresh token has been used before.");
		return null;
	}

	// Invalidate the old refresh token
	usedTokens.add(refreshToken);

	// Generate a new access token
	const accessToken = generateAccessToken(id);

	// Generate a new refresh token
	const newRefreshToken = generateRefreshToken(id, family);

	logger.mark("Refreshed tokens for user", id);

	// Return the new access token and refresh token
	return { accessToken, refreshToken: newRefreshToken };
};

module.exports = refreshTokens;
