const db = require("../../db/db");

/** A route to get all the info of a user.  */
const user = async (req, res) => {
	// Get the id
	const id = req.userId;
	if (id == null) {
		logger.trace("No id provided to get user route.");
		return res.status(400).send("No id provided.");
	}

	// Get the user from the database
	const user = await db.users.get(id);

	// If the user doesn't exist, return a 404
	if (user == null) {
		logger.trace(`User ${id} not found in database.`);
		return res.status(404).send("User not found.");
	}

	// Get the JSON
	const userJson = user.toJSON();

	// Strip the password
	delete userJson.password;

	// Send the JSON
	res.json(userJson);
	logger.mark(`User ${id} successfully sent to client.`);
};

module.exports = user;
