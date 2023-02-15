import login from "/js/methods/login.js";
import getId from "/js/methods/getId.js";

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async () => {
	const displayName = document.getElementById("display-name").value;
	const password = document.getElementById("password").value;

	const id = await getId(displayName);
	if (id == null) return console.log("User does not exist.");

	const success = await login(id, password);
	if (success) {
		console.log("Logged in!");
		window.location.href = "/dashboard";
	} else console.log("Failed to log in.");
});
