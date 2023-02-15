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
	if (!response.ok) return false;

	const { accessToken, refreshToken } = await response.json();
	if (accessToken == null || refreshToken == null) return false;

	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("refreshToken", refreshToken);

	return true;
};

export default login;
