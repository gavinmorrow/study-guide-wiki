const logger = require("../../../logger");
const jwt = require("jsonwebtoken");
const refreshTokens = require("../../authentication/refreshTokens");
const setAuthCookies = require("./setAuthCookies");

const whitelist = [
	{ path: /^$/, method: "GET" },
	{ path: /^signup$/, method: "GET" },
	{ path: /^login$/, method: "GET" },
	{ path: /^css/, method: "GET" },
	{ path: /^js/, method: "GET" },
	{ path: /^api$/, method: "GET" },
	{ path: /^api\/login$/, method: "POST" },
	{ path: /^api\/signup$/, method: "POST" },
	{ path: /^api\/refresh$/, method: "POST" },
	{ path: /^api\/user\/id/, method: "GET" },
];

const attemptToRefreshTokens = async (req, res, next) => {
	// Try to refresh the token
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken == null) {
		logger.trace("No refresh token found when attempting to refresh tokens.");
		return unauthenticatedRoute(req, res);
	}

	try {
		const newTokens = await refreshTokens(refreshToken);
		if (newTokens == null) {
			logger.trace("Could not refresh tokens.");
			return unauthenticatedRoute(res);
		}

		setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
		req.userId = newTokens.id;
		logger.trace("Successfully refreshed tokens.");

		next();
	} catch (err) {
		logger.error("Error refreshing tokens:", err);
		return unauthenticatedRoute(req, res);
	}
};

const unauthenticatedRoute = (req, res) => {
	const isApiRoute = req.path.startsWith("/api");
	logger.trace(`Unauthenticated route: ${req.path} (API: ${isApiRoute})`);
	if (isApiRoute) {
		// Direct API request
		res.sendStatus(401);
		logger.trace(`Sent 401 status code to API request ${req.path}`);
	} else {
		// Frontend request
		res.redirect("/login");
		logger.trace(`Redirected to login page from ${req.path}`);
	}
};

/**
 * A route to authenticate a user.
 * @param {import("express").Request} req The request.
 * @param {import("express").Response} res The response.
 * @param {import("express").NextFunction} next The next function.
 */
const authenticate = async (req, res, next) => {
	// Ensure that authentication is needed
	const path = req.path.replace("/", ""); // Only replaces first / (the start of the path)
	const method = req.method;
	logger.trace(`Authenticating route: ${method} ${path}`);
	if (whitelist.some(route => route.path.test(path) && route.method === method)) {
		logger.trace(`Route ${method} ${path} is whitelisted.`);
		return next();
	}

	// Get the auth cookies value
	const token = req.cookies.authorization;
	if (token == null) {
		logger.trace("No authorization token found.");
		return await attemptToRefreshTokens(req, res, next);
	}

	try {
		// Verify the token is valid
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		// @ts-ignore
		if (decoded.id == null) {
			logger.debug(`Invalid access token (no id): ${decoded}`);
			return await unauthenticatedRoute(req, res);
		}
		// @ts-ignore
		req.userId = decoded.id;

		logger.trace(`Successfully authenticated route ${method} ${path}`);
		next();
	} catch (err) {
		logger.trace("Error while verifying access token:", err);
		return await attemptToRefreshTokens(req, res, next);
	}
};

module.exports = authenticate;
