const jwt = require("jsonwebtoken");

const whitelist = [
	{ path: "/", method: "GET" },
	{ path: "/login", method: "POST" },
	{ path: "/signup", method: "POST" },
	{ path: "/refresh", method: "POST" },
];

/**
 * A route to authenticate a user.
 * @param {import("express").Request} req The request.
 * @param {import("express").Response} res The response.
 * @param {import("express").NextFunction} next The next function.
 */
const authenticate = (req, res, next) => {
	// Ensure that authentication is needed
	const path = req.path;
	const method = req.method;
	if (
		whitelist.some(route => route.path === path && route.method === method)
	) {
		return next();
	}

	// Get the auth header value
	const authHeader = req.headers.authorization;
	if (authHeader == null) return res.sendStatus(401);

	// Extract the token from the header
	const token = authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	// Verify the token is valid
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.sendStatus(401);
		}

		req.userId = decoded.id;
		next();
	});
};

module.exports = authenticate;
