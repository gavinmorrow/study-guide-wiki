const logger = require("../../logger");
/**
 * Sets the authorization and refresh token cookies on the given response.
 * This *does not* send the response.
 * @param {import("express").Response} res The response.
 * @param {string} accessToken The access token.
 * @param {string} refreshToken The refresh token.
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
	// Set the cookie
	if (accessToken != null) {
		logger.mark("Setting authorization cookie.");
		res.cookie("authorization", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 25, // *About* 15 minutes (in milliseconds)
		});
	} else logger.trace("Found null access token when setting cookie.");
	if (refreshToken != null) {
		logger.mark("Setting refresh token cookie.");
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 3, // *About* 3 days (in milliseconds)
		});
	} else logger.trace("Found null refresh token when setting cookie.");
};

module.exports = setAuthCookies;
