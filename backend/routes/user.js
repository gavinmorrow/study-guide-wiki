const db = require("../db/db");
const authenticate = require("./authenticate");

/** A route to get all the info of a user.  */
const user = async (req, res) => {
    // Get the id
    const id = req.userId;
    if (id == null) return res.status(400).send("No id provided.");

    // Get the user from the database
    const user = await db.users.get(id);

    // If the user doesn't exist, return a 404
    if (user == null) return res.status(404).send("User not found.");

    // Get the JSON
    const userJson = user.toJSON();

    // Strip the password
    delete userJson.password;

    // Send the JSON
    res.json(userJson);
};

module.exports = [authenticate, user];
