const jwt = require("jsonwebtoken");

/**
 * A route to authenticate a user.
 */
const authenticate = (req, res, next) => {
    // Get the auth header value
    const authHeader = req.headers.authorization;
    if (authHeader == null) return res.sendStatus(401);

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    // Verify the token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticate;
