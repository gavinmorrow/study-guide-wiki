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

const attemptToRefreshTokens = (req, res, next) => {
	// Try to refresh the token
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken == null) return unauthenticatedRoute(req, res);

	try {
		const newTokens = refreshTokens(refreshToken);
		if (newTokens == null) return unauthenticatedRoute(res);
		setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
		req.userId = newTokens.accessToken.userId;
		next();
	} catch (err) {
		return unauthenticatedRoute(req, res);
	}
};

const unauthenticatedRoute = (req, res) => {
	const isApiRoute = req.path.startsWith("/api");
	if (isApiRoute) {
		// Direct API request
		res.sendStatus(401);
	} else {
		// Frontend request
		res.redirect("/login");
	}
};

/**
 * A route to authenticate a user.
 * @param {import("express").Request} req The request.
 * @param {import("express").Response} res The response.
 * @param {import("express").NextFunction} next The next function.
 */
const authenticate = (req, res, next) => {
	// Ensure that authentication is needed
	const path = req.path.replace("/", ""); // Only replaces first / (the start of the path)
	const method = req.method;
	if (
		whitelist.some(
			route => route.path.test(path) && route.method === method
		)
	) {
		return next();
	}

	// Get the auth cookies value
	const token = req.cookies.authorization;
	if (token == null) return attemptToRefreshTokens(req, res, next);

	// Verify the token is valid
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return attemptToRefreshTokens(req, res, next);

		req.userId = decoded.id;
		next();
	});
};

module.exports = authenticate;
