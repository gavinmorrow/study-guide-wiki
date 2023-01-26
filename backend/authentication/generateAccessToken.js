const jwt = require("jsonwebtoken");

/**
 * Creates a token with the given payload.
 * @param {string | object | buffer } payload The data to encode in the JWT.
 * @returns {string} The token.
 */
const generateAccessToken = payload => {
    // Ensure that the ACCESS_TOKEN_SECRET environment variable is set
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET environment variable is not set");
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
    return token;
};

module.exports = generateAccessToken;
