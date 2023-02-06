const db = require("../../db/db");

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
};

const POST_guide = (req, res) => {};

const PUT_guide = (req, res) => {};

const DELETE_guide = (req, res) => {};

const ALL_guide = async (req, res) => {
	const method = req.method;
	switch (method) {
		case "GET":
			return await GET_guide(req, res);
		case "POST":
			return POST_guide(req, res);
		case "PUT":
			return PUT_guide(req, res);
		case "DELETE":
			return DELETE_guide(req, res);
		default:
			return res.sendStatus(405);
	}
};

module.exports = guide;
