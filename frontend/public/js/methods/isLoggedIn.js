import request from "/js/methods/request.js";

const isLoggedIn = async () => {
	// Check if we can access a protected route
	const response = await request("/api/protected");
	return response.ok;
};

export default isLoggedIn;
