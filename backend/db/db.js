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
                user => new User(user.id, user.password)
            );
        },

        /**
         * Gets a user from the database.
         * @param {string} id The id of the user.
         * @returns {Promise<User?>}
         */
        async get(id) {
            const user = await db.raw.oneOrNone(
                "SELECT * FROM users WHERE id = $1",
                id
            );

            if (user == null) return null;

            return new User(user.id, user.password);
        },

        /**
         * Adds a user to the database.
         * @param {User} user The user to add.
         */
        async add(user) {
            await db.raw.none(
                "INSERT INTO users (id, password) VALUES ($1, $2)",
                [user.id, user.password]
            );
        },
    },
};

module.exports = db;
