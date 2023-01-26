const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const db = pgp(process.env.DB_URL);

module.exports = db;
