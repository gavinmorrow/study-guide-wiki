const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const database = pgp(process.env.DB_URL);

const User = require("../classes/User");

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
            return (await db.raw.any("SELECT * FROM users")).map(
                user => new User(user.id, user.password, user.displayName)
            );
        },

        /**
         * Gets a user from the database.
         * @param {string} id The id of the user.
         * @returns {Promise<User?>}
         */
        async get(id) {
            if (id == null) return null;

            const user = await db.raw.oneOrNone(
                "SELECT * FROM users WHERE id = $1",
                [id]
            );

            if (user == null) return null;

            return new User(user.id, user.password, user.displayName);
        },

        /**
         * Adds a user to the database.
         * @param {User} user The user to add.
         */
        async add(user) {
            await db.raw.none(
                "INSERT INTO users (id, password, displayName) VALUES ($1, $2, $3)",
                [user.id, user.password, displayName]
            );
        },
    },
};

module.exports = db;
