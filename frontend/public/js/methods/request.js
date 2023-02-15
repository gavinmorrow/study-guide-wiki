const host = "http://localhost:8080";

/**
 * @param {string} url The url to fetch. It must start with a `/`.
 * @param {string} [method="GET"] The method to use. GET, POST, PUT, DELETE, etc. Defaults to GET.
 * @param {object} [body] The body of the request. Defaults to null.
 * @param {object} [headers={}] Any extra headers of the request. Defaults to {}.
 * @param {boolean} [authenticate=true] Whether or not to authenticate the request. Defaults to true.
 * @returns {Promise<Response>} The response from the server. The raw response from `fetch`.
 */
const request = (
	url,
	method = "GET",
	body = null,
	headers = {},
	authenticate = true
) =>
	fetch(`${host}${url}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization:
				authenticate && localStorage.getItem("accessToken")
					? `Bearer ${localStorage.getItem("accessToken")}`
					: undefined,
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

export default request;
export { host };
