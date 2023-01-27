const db = require("../db/db");
const bcrypt = require("bcrypt");

/**
 * A function to check if an id and password are valid in the database
 * @param {string} id The id of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<boolean>}
 */
const credentialsAreValid = async (id, password) => {
    // Get the user
    const user = await db.users.get(id);
    if (!user) {
        return false;
    }

    // Compare the password
    const validPassword = bcrypt.compareSync(password, user.password);
    return validPassword;
};

module.exports = credentialsAreValid;
