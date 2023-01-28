const generateAccessToken = require("../authentication/generateAccessToken");
const db = require("../db/db");
const User = require("../classes/User");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

// TODO: Refactor (split into multiple functions/files)

/**
 * A route to create a new user.
 * @param {import("express").Request} req The request.
 * @param {import("express").Response} res The response.
 */
const signup = async (req, res) => {
    const { password, displayName } = req.body;

    // Ensure that the password and display name are valid
    if (password == null) res.status(400).send("Password is required");
    if (displayName == null || displayName.length < 1)
        res.status(400).send("Display name is required");

    // Ensure that the display name is unique
    if (await db.users.displayNameIsUsed(displayName))
        res.status(400).send("Display name is already in use");

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds).catch(err => {
        res.sendStatus(500);
        throw err;
    });

    // Generate a random ID for the user
    /**
     * A random id for the user.
     * @type {string}
     */
    let id;

    // Ensure that the id is unique.
    // This is very unlikely to happen, but it's still possible.
    // (https://en.wikipedia.org/wiki/Universally_unique_identifier#Collisions)
    do {
        id = crypto.randomUUID();
    } while ((await db.users.get(id)) != null);

    try {
        // Create the user and add it to the database
        const user = new User(id, passwordHash, displayName);
        await db.users.add(user);
    } catch (err) {
        res.sendStatus(500);
        console.error(err);
        return;
    }

    res.json({ id });
};

module.exports = signup;
