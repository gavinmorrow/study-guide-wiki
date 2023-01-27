const db = require("../db/db");
const authenticate = require("./authenticate");

/** A route to get all the info of a user.  */
const user = (req, res) => {
    // Get the id
    const id = req.userId;
    if (id == null) return res.status(400).send("No id provided.");

    // Get the user from the database
    const user = db.users.get(id);

    // If the user doesn't exist, return a 404
    if (user == null) return res.status(404).send("User not found.");

    // Return the user
    res.json(user);
};

module.exports = [authenticate, user];
