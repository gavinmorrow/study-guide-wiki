const credentialsAreValid = require("../authentication/credentialsAreValid");
const generateAccessToken = require("../authentication/generateAccessToken");
const generateRefreshToken = require("../authentication/generateRefreshToken");

/** A route to login a user and return a JWT. */
const login = async (req, res) => {
    // Get the username and password from the request body
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(400).send("Id and password required");
    }

    // Check if the id and password are correct
    if (!credentialsAreValid(id, password)) {
        return res.status(401).send("Invalid credentials");
    }

    // Generate an access token with the id as the payload
    const accessToken = generateAccessToken(id);

    // Generate a refresh token with the id as the payload
    const refreshToken = generateRefreshToken(id);

    // Return the token to the user
    res.json({ accessToken, refreshToken });
};

module.exports = login;
