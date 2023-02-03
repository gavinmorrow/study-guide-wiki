const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const getAll = async user => {
    const tableName = user ? "users" : "guides";
    /** @type {User|Guide} */ const Type = user ? User : Guide;
    const data = await db.raw.any(`SELECT * FROM ${tableName}`);
    return data.map(Type.fromObject);
};

const get = async (id, user) => {
    const tableName = user ? "users" : "guides";
    /** @type {User|Guide} */ const Type = user ? User : Guide;

    if (id == null) return null;

    const data = await db.raw.oneOrNone(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
    );

    if (data == null) return null;

    return Type.fromObject(data);
};

const db = {
    /** Gets the raw database (pg-promise) object. */
    get raw() {
        return database;
    },

    users: {
        /**
         * Gets all users from the database.
         * @returns {Promise<User[]>}
         */
        async getAll() {
            return getAll(true);
        },

        /**
         * Gets a user from the database.
         * @param {string} id The id of the user.
         * @returns {Promise<User?>}
         */
        async get(id) {
            return get(id, true);
        },

        /**
         * Checks if a display name is used.
         * @param {string} displayName The display name to check.
         * @returns {Promise<boolean>}
         */
        async displayNameIsUsed(displayName) {
            const user = await db.raw.oneOrNone(
                "SELECT * FROM users WHERE displayName = $1",
                [displayName]
            );
            return user != null;
        },

        /**
         * Adds a user to the database.
         * @param {User} user The user to add.
         */
        async add(user) {
            await db.raw.none(
                "INSERT INTO users (id, password, displayName) VALUES ($1, $2, $3)",
                [user.id, user.password, user.displayName]
            );
        },
    },

    guides: {
        async getAll() {
            return getAll(false);
        },

        async get(id) {
            return get(id, false);
        },
    },
};

module.exports = db;
