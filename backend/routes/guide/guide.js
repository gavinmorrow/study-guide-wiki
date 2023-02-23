const logger = require("../../logger");
const db = require("../../db/db");
const Guide = require("../../classes/Guide");
const PermissionLevel = require("../../classes/PermissionLevel");

/**
 * A route to fetch the data for a guide.
 * @param {import("express").Request} req The request object.
 * @param {import("express").Response} res The response object.
 */
const get = async (req, res) => {
	const guideId = req.params.id;
	const userId = req.userId;

	if (!guideId) {
		logger.trace("No guide id supplied to guide route.");
		return res.sendStatus(400);
	}

	/** @type {Guide?} */
	const guide = await db.guides.get(guideId);
	const guideJson = guide?.toJSON();

	if (!guideJson) {
		logger.trace(`Guide ${guideId} not found in database.`);
		return res.sendStatus(404);
	}

	// Ensure that the user is allowed to view the guide.
	// The permission level isn't important here because
	// anyone in the list has at least read access.
	const userHasAccess =
		guideJson.people.includes(userId) || guideJson.authorId === userId;
	if (!userHasAccess) {
		logger.trace(
			`User ${userId} does not have access to guide ${guideId}.`
		);
		return res.sendStatus(401);
	}

	res.json(guideJson);
	logger.mark(`Guide ${guideId} successfully sent to user ${userId}.`);
};

/**
 * A route to create a new guide.
 * @param {import("express").Request} req The request object.
 * @param {import("express").Response} res The response object.
 */
const post = async (req, res) => {
	/**
	 * @type { {
	 * 	title: string,
	 * 	authorId: string,
	 * 	people: [{ id: string, permissionLevel: string }]
	 * } }
	 */
	const guideJson = req.body;
	guideJson.authorId = req.userId;

	if (
		guideJson.title == null ||
		guideJson.authorId == null ||
		guideJson.people == null
	) {
		logger.trace("Invalid guide data supplied to guide route.");
		return res.sendStatus(400);
	}

	// Map string permission levels to `PermissionLevel` values
	try {
		guideJson.people = guideJson.people.map(({ id, permissionString }) => {
			const permissionLevel =
				PermissionLevel.fromString(permissionString);

			if (permissionLevel == null) {
				logger.error("Found invalid permission level in guide data.");
				throw new Error("Invalid permission level");
			}

			return {
				id,
				permissionLevel,
			};
		});
		logger.trace("Successfully mapped permission levels.");
	} catch (err) {
		if (err.message.startsWith("Invalid permission level")) {
			return res.sendStatus(400);
		} else {
			logger.error(err);
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
		logger.mark(`Generating id for new guide.`);
	} while ((await db.guides.get(id)) != null);

	// Create a guide class
	const guide = new Guide(
		id,
		guideJson.title,
		guideJson.authorId,
		guideJson.people
	);

	// Add the guide to the database
	await db.guides.add(guide);

	logger.mark(`Guide ${id} successfully created and added to database.`);

	res.status(201).json({ id });

	logger.mark(`Guide ${id} successfully sent to client.`);
};

const patch = async (req, res) => {
	const { id: guideId, newTitle } = req.body;
	const userId = req.userId;

	if (guideId == null || newTitle == null || newTitle?.length === 0) {
		logger.trace("Invalid guide data supplied to guide route.");
		return res.sendStatus(400);
	}

	const guide = await db.guides.get(guideId);
	if (guide == null) {
		logger.trace(
			`Guide ${guideId} not found in database when attempting to update.`
		);
		return res.sendStatus(404);
	}

	// Ensure that the user is allowed to update the guide.
	// Must be owner or have manage permissions.
	const userHasAccess =
		guide.authorId === userId ||
		guide.people.filter(
			({ id, permissionLevel }) =>
				id === userId && permissionLevel === PermissionLevel.manage
		).length === 1;

	if (!userHasAccess) {
		logger.trace(
			`User ${userId} does not have access to update guide ${guideId}.`
		);
		return res.sendStatus(401);
	}

	// Update the guide
	const response = await db.guides.updateTitle(guideId, newTitle);
	if (response) {
		logger.mark(`Guide ${guideId} successfully updated.`);
		res.sendStatus(200);
	} else {
		logger.trace(`Guide ${guideId} failed to update.`);
		res.sendStatus(500);
	}
};

const delete_ = async (req, res) => {
	const guideId = req.params.id;
	const userId = req.userId;

	if (!guideId) {
		logger.trace("No guide id supplied to delete guide route.");
		return res.sendStatus(400);
	}

	const guide = await db.guides.get(guideId);
	if (guide == null) {
		logger.trace(
			`Guide ${guideId} not found in database when attempting to delete.`
		);
		return res.sendStatus(404);
	}

	// Ensure that the user is allowed to delete the guide.
	// Only the owner can delete the guide.
	const userHasAccess = guide.authorId === userId;
	if (!userHasAccess) {
		logger.trace(
			`User ${userId} does not have access to delete guide ${guideId}.`
		);
		return res.sendStatus(401);
	}

	// Remove the guide from the database
	await db.guides.delete(guideId);

	logger.mark(`Guide ${guideId} successfully deleted from database.`);

	res.sendStatus(204);
};

const express = require("express");
const router = express.Router();

router.route("/:id").get(get).delete(delete_);
router.route("/").post(post).patch(patch);

module.exports = router;
