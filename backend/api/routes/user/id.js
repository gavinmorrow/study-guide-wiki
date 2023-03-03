const logger = require("../../../logger");
const db = require("../../../db/db");

/** A route to get the id of a user from their display name.  */
const getId = async (req, res) => {
	// Get the display name
	const displayName = req.params.displayName;
	if (displayName == null) {
		logger.debug("No display name provided to get id route.");
		return res.status(400).send("No id provided.");
	}

	// Get the user from the database
	const id = await db.users.getId(displayName);

	// If the user doesn't exist, return a 404
	if (id == null) {
		logger.debug(`User ${displayName} not found in database.`);
		return res.status(404).send("User not found.");
	}

	// Send the id
	res.json({ id });
	logger.trace(`Id ${id} successfully sent to client.`);
};

module.exports = getId;
