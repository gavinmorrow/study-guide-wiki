var log4js = require("log4js");

// Log levels: ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
log4js.configure({
	appenders: {
		notImportant: {
			type: "stdout",
			layout: {
				type: "pattern",
				pattern: "%[[%d] [%p] [%f:%l] %c - %]%m",
			},
		},
		notImportantFilter: {
			type: "logLevelFilter",
			level: "trace",
			maxLevel: "debug",
			appender: "notImportant",
		},
		important: {
			type: "stdout",
			layout: {
				type: "pattern",
				pattern: "%[[%d] [%p] %c - %]%m",
			},
		},
		importantFilter: {
			type: "logLevelFilter",
			level: "info",
			appender: "important",
		},
	},
	categories: {
		default: {
			appenders: ["importantFilter", "notImportantFilter"],
			level: "all",
			enableCallStack: true,
		},
	},
});

var logger = log4js.getLogger();
logger.level = "all";
logger.info("Logger initialized.");

module.exports = logger;
