/**
 * A user class. It *does not* sync with the database.
 */
class User {
    /**
     * The id (UUID) of the user. This is private to prevent setting.
     * @type {string}
     */
    get id() {
        return this.#id;
    }
    #id;

    /**
     * The password of the user. This is hashed with bcrypt.
     * @type {string}
     */
    get password() {
        return this.#password;
    }
    #password;

    /**
     * The user's display name.
     *
     * This is unqiue, but NOT what should be used to identify them,
     * as it can change at any time.
     *
     * @type {string}
     */
    get displayName() {
        return this.#displayName;
    }
    #displayName;

    /**
     * @param {string} id The id of the user. This is a UUID.
     * @param {string} password The password of the user. This is hashed with bcrypt.
     * @param {string} displayName The user's display name.
     */
    constructor(id, password, displayName) {
        this.#id = id;
        this.#password = password;
        this.#displayName = displayName;
    }

    /**
     * Returns a JSON representation of the user.
     * @returns { { id: string, password: string } } The JSON representation of the user.
     */
    toJSON() {
        return {
            id: this.id,
            password: this.password,
        };
    }

    /**
     * Converts an object to a user class.
     * @param { { id: string, password: string, displayName: string } } user The user object to convert.
     * @returns {User}
     */
    static fromObject(user) {
        return new User(user.id, user.password, user.displayName);
    }
}

module.exports = User;
