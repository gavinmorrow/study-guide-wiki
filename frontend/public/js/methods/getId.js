import request from "/js/methods/request.js";

/**
 * Gets the id of a user.
 * @param {string} displayName
 * @returns {Promise<string>} The id of the user. `null` if the user does not exist.
 */
const getId = async displayName => {
	const response = await request(`/api/user/id/${displayName}`, "GET", null, false);
	if (!response.ok) return null;

	const { id } = await response.json();
	return id;
};

export default getId;
