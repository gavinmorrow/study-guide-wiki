const jwt = require("jsonwebtoken");
const generateAccessToken = require("../authentication/generateAccessToken");
const generateRefreshToken = require("../authentication/generateRefreshToken");

/** A route to refresh a JWT. It takes a refresh token and returns a new access token and refresh token. */
const refresh = async (req, res) => {
    // Get the refresh token from the request body
    const { refreshToken } = req.body;
    if (refreshToken == null) {
        return res.status(401).send("Refresh token required");
    }

    // Verify the refresh token
    let oldRefreshToken;
    try {
        oldRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        if (!(err instanceof jwt.JsonWebTokenError)) {
            throw err;
		}
		
        return res.status(401).send("Invalid refresh token");
    }

    // Generate a new access token
    const accessToken = generateAccessToken(oldRefreshToken.id);

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(oldRefreshToken.id);

    // Return the new access token and refresh token to the user
    res.json({ accessToken, refreshToken: newRefreshToken });
};

module.exports = refresh;
