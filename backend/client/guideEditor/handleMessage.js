const handlePong = require("./handle/pong");
const handleUpdateGuideTitle = require("./handle/updateGuideTitle");
const handleNewSection = require("./handle/newSection");
const handleUpdateSectionTitle = require("./handle/updateSectionTitle");
const handleDeleteSection = require("./handle/deleteSection");
const handleNewParagraph = require("./handle/newParagraph");
const handleUpdateParagraph = require("./handle/updateParagraph");
const handleDeleteParagraph = require("./handle/deleteParagraph");
const handleLockParagraph = require("./handle/lockParagraph");
const handleUnlockParagraph = require("./handle/unlockParagraph");
const handleError = require("./handle/error");

const WSMessage = require("../classes/WSMessage");

const logger = require("../../logger");

const handleMessage = async (msg, ws, session) => {
	logger.trace("Message from the client:", msg);

	switch (msg.type) {
		case "pong":
			await handlePong();
			break;

		case "updateGuideTitle":
			await handleUpdateGuideTitle(ws, msg.data, session);
			break;

		case "newSection":
			await handleNewSection(ws, msg.data, session);
			break;

		case "updateSectionTitle":
			await handleUpdateSectionTitle(ws, msg.data, session);
			break;

		case "deleteSection":
			await handleDeleteSection(ws, msg.data, session);
			break;

		case "newParagraph":
			await handleNewParagraph(ws, msg.data, session);
			break;

		case "updateParagraph":
			await handleUpdateParagraph(ws, msg.data, session);
			break;

		case "deleteParagraph":
			await handleDeleteParagraph(ws, msg.data, session);
			break;

		case "lockParagraph":
			await handleLockParagraph(ws, msg.data, session);
			break;

		case "unlockParagraph":
			await handleUnlockParagraph(ws, msg.data, session);
			break;

		case "error":
			await handleError(ws, msg.data, session);
			break;

		default:
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

module.exports = handleMessage;
