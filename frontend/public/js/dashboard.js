import isLoggedIn from "/js/methods/isLoggedIn.js";

if (!(await isLoggedIn())) {
	window.location.href = "/login";
}
