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
		logger.mark(
			"No refresh token found when attempting to refresh tokens."
		);
		return unauthenticatedRoute(req, res);
	}

	try {
		const newTokens = await refreshTokens(refreshToken);
		if (newTokens == null) {
			logger.mark("Could not refresh tokens.");
			return unauthenticatedRoute(res);
		}

		setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
		req.userId = newTokens.id;
		logger.mark("Successfully refreshed tokens.");

		next();
	} catch (err) {
		logger.error("Error refreshing tokens:", err);
		return unauthenticatedRoute(req, res);
	}
};

const unauthenticatedRoute = (req, res) => {
	const isApiRoute = req.path.startsWith("/api");
	logger.mark(`Unauthenticated route: ${req.path} (API: ${isApiRoute})`);
	if (isApiRoute) {
		// Direct API request
		res.sendStatus(401);
		logger.mark(`Sent 401 status code to API request ${req.path}`);
	} else {
		// Frontend request
		res.redirect("/login");
		logger.mark(`Redirected to login page from ${req.path}`);
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
	logger.mark(`Authenticating route: ${method} ${path}`);
	if (
		whitelist.some(
			route => route.path.test(path) && route.method === method
		)
	) {
		logger.mark(`Route ${method} ${path} is whitelisted.`);
		return next();
	}

	// Get the auth cookies value
	const token = req.cookies.authorization;
	if (token == null) {
		logger.mark("No authorization token found.");
		return await attemptToRefreshTokens(req, res, next);
	}

	try {
		// Verify the token is valid
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		if (decoded.id == null) {
			logger.trace(`Invalid access token (no id): ${decoded}`);
			return await unauthenticatedRoute(req, res);
		}
		req.userId = decoded.id;

		logger.mark(`Successfully authenticated route ${method} ${path}`);
		next();
	} catch (err) {
		logger.mark("Error while verifying access token:", err);
		return await attemptToRefreshTokens(req, res, next);
	}
};

module.exports = authenticate;
