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

const handleMessage = async (msg, ws) => {
	logger.trace("Message from the client:", msg);

	switch (msg.type) {
		case "pong":
			await handlePong();
			break;

		case "updateGuideTitle":
			await handleUpdateGuideTitle(ws, msg.data);
			break;

		case "newSection":
			await handleNewSection(ws, msg.data);
			break;

		case "updateSectionTitle":
			await handleUpdateSectionTitle(ws, msg.data);
			break;

		case "deleteSection":
			await handleDeleteSection(ws, msg.data);
			break;

		case "newParagraph":
			await handleNewParagraph(ws, msg.data);
			break;

		case "updateParagraph":
			await handleUpdateParagraph(ws, msg.data);
			break;

		case "deleteParagraph":
			await handleDeleteParagraph(ws, msg.data);
			break;

		case "lockParagraph":
			await handleLockParagraph(ws, msg.data);
			break;

		case "unlockParagraph":
			await handleUnlockParagraph(ws, msg.data);
			break;

		case "error":
			await handleError(ws, msg.data);
			break;

		default:
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

module.exports = handleMessage;
