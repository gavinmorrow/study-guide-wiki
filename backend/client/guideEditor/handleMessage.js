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

const handleMessage = (msg, ws) => {
	logger.trace("Message from the client:", msg);

	switch (msg.type) {
		case "pong":
			handlePong();
			break;

		case "updateGuideTitle":
			handleUpdateGuideTitle(ws, msg.data);
			break;

		case "newSection":
			handleNewSection(ws, msg.data);
			break;

		case "updateSectionTitle":
			handleUpdateSectionTitle(ws, msg.data);
			break;

		case "deleteSection":
			handleDeleteSection(ws, msg.data);
			break;

		case "newParagraph":
			handleNewParagraph(ws, msg.data);
			break;

		case "updateParagraph":
			handleUpdateParagraph(ws, msg.data);
			break;

		case "deleteParagraph":
			handleDeleteParagraph(ws, msg.data);
			break;

		case "lockParagraph":
			handleLockParagraph(ws, msg.data);
			break;

		case "unlockParagraph":
			handleUnlockParagraph(ws, msg.data);
			break;

		case "error":
			handleError(ws, msg.data);
			break;

		default:
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

module.exports = handleMessage;
