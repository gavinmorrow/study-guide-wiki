const credentialsAreValid = require("../authentication/credentialsAreValid");
const generateAccessToken = require("../authentication/generateAccessToken");

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

    // Generate a JWT token with the id as the payload
    const token = generateAccessToken(id);

    // Return the token to the user
    res.send(token);
};

module.exports = login;
