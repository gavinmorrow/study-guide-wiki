/**
 * Sets the authorization and refresh token cookies on the given response.
 * This *does not* send the response.
 * @param {import("express").Response} res The response.
 * @param {string} accessToken The access token.
 * @param {string} refreshToken The refresh token.
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
	// Set the cookie
	res.cookie("authorization", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 1000 * 60 * 25, // *About* 15 minutes (in milliseconds)
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 1000 * 60 * 60 * 24 * 3, // *About* 3 days (in milliseconds)
	});
};

module.exports = setAuthCookies;
