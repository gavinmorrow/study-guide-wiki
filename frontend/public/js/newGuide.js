import request from "./methods/request.js";

const form = document.getElementById("create-guide-modal-form");
form.addEventListener("submit", event => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const values = Object.fromEntries(formData);
	console.log(values);
});
