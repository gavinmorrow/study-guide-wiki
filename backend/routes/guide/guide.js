const db = require("../../db/db");
const Guide = require("../../classes/Guide");
const PermissionLevel = require("../../classes/PermissionLevel");

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
	const userHasAccess =
		guideJson.people.includes(userId) || guideJson.authorId === userId;
	if (!userHasAccess) {
		return res.sendStatus(401);
	}

	res.json(guideJson);
};

/**
 * A route to create a new guide.
 * @param {import("express").Request} req The request object.
 * @param {import("express").Response} res The response object.
 */
const POST_guide = async (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.sendStatus(401);
	}

	/**
	 * @type { {
	 * 	title: string,
	 * 	description: string,
	 * 	authorId: string,
	 * 	grade: number,
	 * 	subject: string,
	 * 	teacher: string,
	 * 	year: string,
	 * 	people: [{ id: string, permissionLevel: string }]
	 * } }
	 */
	const guideJson = req.body;
	guideJson.authorId = userId;

	if (
		guideJson.title == null ||
		guideJson.description == null ||
		guideJson.authorId == null ||
		guideJson.grade == null ||
		guideJson.subject == null ||
		guideJson.teacher == null ||
		guideJson.year == null ||
		guideJson.people == null
	) {
		return res.sendStatus(400);
	}

	// Map string permission levels to `PermissionLevel` values
	try {
		guideJson.people = guideJson.people.map((person, permissionString) => {
			const permissionLevel =
				PermissionLevel.fromString(permissionString);

			if (permissionLevel == null) {
				throw new Error("Invalid permission level");
			}

			return {
				id: person,
				permissionLevel,
			};
		});
	} catch (err) {
		if (err.message.startsWith("Invalid permission level")) {
			return res.sendStatus(400);
		} else {
			console.error(err);
			return res.sendStatus(500);
		}
	}

	// Generate a random ID for the guide
	/**
	 * A random id for the guide.
	 * @type {string}
	 */
	let id;

	// Ensure that the id is unique.
	// This is very unlikely to happen, but it's still possible.
	// (https://en.wikipedia.org/wiki/Universally_unique_identifier#Collisions)
	do {
		id = crypto.randomUUID();
	} while ((await db.guides.get(id)) != null);

	// Create a guide class
	const guide = new Guide(
		id,
		guideJson.title,
		guideJson.description,
		guideJson.authorId,
		guideJson.grade,
		guideJson.subject,
		guideJson.teacher,
		guideJson.year,
		guideJson.people
	);

	// Add the guide to the database
	await db.guides.add(guide);

	res.json({ id });
};

const DELETE_guide = async (req, res) => {
	const guideId = req.params.id;
	const userId = req.userId;

	if (!guideId) {
		return res.sendStatus(400);
	}

	const guide = await db.guides.get(guideId);
	if (guide == null) {
		return res.sendStatus(404);
	}

	// Ensure that the user is allowed to delete the guide.
	// Only the owner can delete the guide.
	const userHasAccess = guide.authorId === userId;
	if (!userHasAccess) {
		return res.sendStatus(401);
	}

	// Remove the guide from the database
	await db.guides.delete(guideId);

	res.sendStatus(200);
};

module.exports = {
	get: GET_guide,
	post: POST_guide,
	delete: DELETE_guide,
};
