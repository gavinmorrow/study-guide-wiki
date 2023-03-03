const logger = require("../../logger");

const generateTokenSecrets = () => {
	const crypto = require("crypto");
	const dev = process.env.NODE_ENV === "development";

	process.env.ACCESS_TOKEN_SECRET = dev
		? "access"
		: crypto.randomBytes(64).toString("hex");
	process.env.REFRESH_TOKEN_SECRET = dev
		? "refresh"
		: crypto.randomBytes(64).toString("hex");

	logger.trace("Token secrets generated.");
};

generateTokenSecrets();
