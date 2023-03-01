const logger = require("../logger");
const database = require("./pgp");
const users = require("./users");
const guides = require("./guides");

const db = {
	users,
	guides
};

module.exports = db;
