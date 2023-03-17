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

const handleMessage = async (msg, ws, userSession, session) => {
	// logger.trace("Message from the client:", msg);

	switch (msg.type) {
		case "pong":
			await handlePong();
			break;

		case "updateGuideTitle":
			await handleUpdateGuideTitle(msg.data, userSession, session);
			break;

		case "newSection":
			await handleNewSection(msg.data, userSession, session);
			break;

		case "updateSectionTitle":
			await handleUpdateSectionTitle(msg.data, userSession, session);
			break;

		case "deleteSection":
			await handleDeleteSection(msg.data, userSession, session);
			break;

		case "newParagraph":
			await handleNewParagraph(msg.data, userSession, session);
			break;

		case "updateParagraph":
			await handleUpdateParagraph(msg.data, userSession, session);
			break;

		case "deleteParagraph":
			await handleDeleteParagraph(msg.data, userSession, session);
			break;

		case "lockParagraph":
			await handleLockParagraph(msg.data, userSession, session);
			break;

		case "unlockParagraph":
			await handleUnlockParagraph(msg.data, userSession, session);
			break;

		case "error":
			await handleError(msg.data, userSession, session);
			break;

		default:
			logger.warn("Invalid message type received:", msg.type);
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

module.exports = handleMessage;
