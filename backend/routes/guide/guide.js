const db = require("../../db/db");
const Guide = require("../../classes/Guide");

/**
 * A route to fetch the data for a guide.
 * @param {import("express").Request} req The request object.
 * @param {import("express").Response} res The response object.
 */
const GET_guide = async (req, res) => {
	const guideId = req.params.id;
	const userId = req.userId;

	if (!guideId) {
		return res.sendStatus(400);
	}

	/** @type {Guide?} */
	const guide = await db.guides.get(guideId);
	const guideJson = guide?.toJSON();

	if (!guideJson) {
		return res.sendStatus(404);
	}

	// Ensure that the user is allowed to view the guide.
	// The permission level isn't important here because
	// anyone in the list has at least read access.
	if (!guideJson.people.includes(userId)) {
		return res.sendStatus(401);
	}

	res.json(guideJson);
};

const POST_guide = (req, res) => {};

const PUT_guide = (req, res) => {};

const DELETE_guide = (req, res) => {};

module.exports = {
	get: GET_guide,
	post: POST_guide,
	put: PUT_guide,
	delete: DELETE_guide,
};
