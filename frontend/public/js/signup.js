import signup from "/js/methods/signup.js";

const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", async event => {
	event.preventDefault();

	const displayName = document.getElementById("display-name").value;
	const password = document.getElementById("password").value;
	const password2 = document.getElementById("password2").value;

	if (displayName.length <= 0) {
		console.error("Display name cannot be empty.");
		return;
	}

	if (password.length < 8) {
		console.error("Password must be at least 8 characters long.");
		return;
	}

	if (password !== password2) {
		console.error("Passwords do not match.");
		return;
	}

	const id = await signup(displayName, password);
	if (id) {
		console.log("Signup successful. ID:", id);
	} else {
		console.error("Signup failed.");
	}
});
