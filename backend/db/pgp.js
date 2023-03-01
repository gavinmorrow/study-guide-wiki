const logger = require("../logger");

const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

logger.info("Connected to database:", process.env.DB_URL);

module.exports = database;
