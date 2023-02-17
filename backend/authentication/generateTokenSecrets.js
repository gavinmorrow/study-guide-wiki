const generateTokenSecrets = () => {
	const crypto = require("crypto");
	const dev = process.env.NODE_ENV === "development";
	process.env.ACCESS_TOKEN_SECRET = dev
		? "access"
		: crypto.randomBytes(64).toString("hex");
	process.env.REFRESH_TOKEN_SECRET = dev
		? "refresh"
		: crypto.randomBytes(64).toString("hex");
	console.log("Access token secret:", process.env.ACCESS_TOKEN_SECRET);
	console.log("Refresh token secret:", process.env.REFRESH_TOKEN_SECRET);
};

generateTokenSecrets();
