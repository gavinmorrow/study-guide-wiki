import request from "/js/methods/request.js";

/**
 * Logs in a user.
 * @param {string} id
 * @param {string} password
 * @returns {Promise<bool>} `true` if login was successful, `false` otherwise.
 */
const login = async (id, password) => {
	if (id == null || password == null) return false;

	const response = await request("/api/login", "POST", { id, password }, false);
	return response.ok;
};

export default login;
