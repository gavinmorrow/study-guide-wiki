var log4js = require("log4js");
var logger = log4js.getLogger();

logger.level = process.env.NODE_ENV === "production" ? "info" : "debug";
logger.debug("Logger initialized.");

module.exports = logger;
