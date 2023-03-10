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

const logger = require("../../logger");

const handleMessage = (msg, ws) => {
	logger.trace("Message from the client:", msg);

	switch (msg.type) {
		case "pong":
			handlePong();
			break;

		case "updateGuideTitle":
			handleUpdateGuideTitle(msg.data);
			break;

		case "newSection":
			handleNewSection(msg.data);
			break;

		case "updateSectionTitle":
			handleUpdateSectionTitle(msg.data);
			break;

		case "deleteSection":
			handleDeleteSection(msg.data);
			break;

		case "newParagraph":
			handleNewParagraph(msg.data);
			break;

		case "updateParagraph":
			handleUpdateParagraph(msg.data);
			break;

		case "deleteParagraph":
			handleDeleteParagraph(msg.data);
			break;

		case "lockParagraph":
			handleLockParagraph(msg.data);
			break;

		case "unlockParagraph":
			handleUnlockParagraph(msg.data);
			break;

		case "error":
			handleError(msg.data);
			break;

		default:
			ws.send(WSMessage.error("Invalid message type", msg.type));
	}
};

module.exports = handleMessage;
