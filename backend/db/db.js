const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");
const Guide = require("../classes/Guide");

const getAll = async Tyoe => {
    const tableName = user ? "users" : "guides";
    const data = await db.raw.any(`SELECT * FROM ${tableName}`);
    return data.map(Type.fromObject);
};

const get = async (Type, id) => {
    const tableName = user ? "users" : "guides";

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
         * @returns {Promise<User[]>} An array of users.
         */
        getAll: getAll.bind(null, User),

        /**
         * Gets a user from the database.
         * @param {string} id The id of the user.
         * @returns {Promise<User?>} The user, or null if it doesn't exist.
         */
        get: get.bind(null, User),

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
        /**
         * Gets all guides from the database.
         * @returns {Promise<Guide[]>} An array of guides.
         */
        getAll: getAll.bind(null, Guide),

        /**
         * Gets a guide from the database.
         * @param {string} id The id of the guide.
         * @returns {Promise<Guide?>} The guide, or null if it doesn't exist.
         */
        get: get.bind(null, Guide),
    },
};

module.exports = db;
