/**
 * A user class. It *does not* sync with the database.
 */
class User {
    /**
     * Same as {@linkcode id}
     * @type {string}
     */
    #id;

    /**
     * The id (UUID) of the user. This is private to prevent setting.
     * @type {string}
     */
    get id() {
        return this.#id;
    }

    /**
     * Same as {@linkcode password}
     * @type {string}
     */
    #password;

    /**
     * The password of the user. This is hashed with bcrypt.
     * @type {string}
     */
    get password() {
        return this.#password;
    }

    constructor(id, password) {
        this.#id = id;
        this.#password = password;
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
}

module.exports = User;
