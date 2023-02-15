import request from "/js/methods/request.js";

/**
 * Signs up a user.
 * @param {string} displayName The display name of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<string?>} Whether or not the signup was successful. If it was, returns the id. If not, returns null.
 */
const signup = async (displayName, password) => {
	const response = await request("/api/signup", "POST", { displayName, password }, false);
	if (!response.ok) {
		console.error("Signup failed. HTTP status code:", response.status);
		return null;
	}

	const { id } = await response.json();
	return id;
};

export default signup;
