const jwt = require("jsonwebtoken");

/**
 * Creates a refresh token for a user.
 * @param {string} id The id of the user to generate a refresh token for.
 * @returns {string} The token.
 */
const generateRefreshToken = id => {
    // Ensure that the REFRESH_TOKEN_SECRET environment variable is set
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET environment variable is not set");
    }

    const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "2d",
    });
    return token;
};

module.exports = generateRefreshToken;
