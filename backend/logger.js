var log4js = require("log4js");
var logger = log4js.getLogger();

log4js.configure({
	appenders: {
		out: {
			type: "stdout",
			layout: {
				type: "pattern",
				pattern: "%[[%d] [%p] [%c] [%f:%l] - %]%m",
			},
		},
	},
	categories: {
		default: { appenders: ["out"], level: "all", enableCallStack: true },
	},
});
logger.level = process.env.NODE_ENV === "production" ? "info" : "all";
logger.debug("Logger initialized.");

module.exports = logger;
