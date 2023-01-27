const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * The refresh token families that have been used.
 * @type {Set<string>} UUIDs
 */
let usedFamilies = new Set();

/**
 * Creates a refresh token for a user.
 * @param {string} id The id of the user to generate a refresh token for.
 * @param {string} [family] The family of the refresh token. If not provided, a new family will be generated.
 * @returns {string} The token.
 */
const generateRefreshToken = (id, family = null) => {
    // Ensure that the REFRESH_TOKEN_SECRET environment variable is set
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET environment variable is not set");
    }

    // Generate a new family if one was not provided
    if (!family) {
        do {
            family = crypto.randomUUID();
        } while (usedFamilies.has(family));
        usedFamilies.add(family);
    }

    const token = jwt.sign({ id, family }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "3d",
    });
    return token;
};

module.exports = generateRefreshToken;
