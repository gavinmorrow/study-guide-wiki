const jwt = require("jsonwebtoken");
const generateAccessToken = require("../authentication/generateAccessToken");
const generateRefreshToken = require("../authentication/generateRefreshToken");

// Each refresh token is only valid for one use
// And whenever an old token is used, the entire family of tokens is invalidated
// Each family is represented by a UUID

/** @type {Set<string>} Raw refresh tokens (JWTs) */
let usedTokens = new Set();

/** @type {Set<string>} UUIDs */
let invalidFamilies = new Set();

/** A route to refresh a JWT. It takes a refresh token and returns a new access token and refresh token. */
const refresh = async (req, res) => {
    // Get the refresh token from the request body
    const { refreshToken } = req.body;
    if (refreshToken == null) {
        return res.status(401).send("Refresh token required");
    }

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
            console.error("Invalid refresh token:", token);
            return res.status(401).send("Invalid refresh token");
        }
    } catch (err) {
        if (!(err instanceof jwt.JsonWebTokenError)) {
            res.sendStatus(500);
            throw err;
        }

        return res.status(401).send("Invalid refresh token");
    }

    // Check if the refresh token family has been invalidated
    if (invalidFamilies.has(family)) {
        return res.status(401).send("Invalid refresh token");
    }

    // If the token has been used before, invalidate the entire family
    if (usedTokens.has(refreshToken)) {
        invalidFamilies.add(family);
        return res.status(401).send("Invalid refresh token");
    }

    // Invalidate the old refresh token
    usedTokens.add(refreshToken);

    // Generate a new access token
    const accessToken = generateAccessToken(id);

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(id, family);

    // Return the new access token and refresh token to the user
    res.json({ accessToken, refreshToken: newRefreshToken });
};

module.exports = refresh;
