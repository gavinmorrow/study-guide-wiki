import request from "./methods/request.js";

const form = document.getElementById("create-guide-modal-form");
form.addEventListener("submit", async event => {
	event.preventDefault();

	const validateGuideValues = (
		await import("./methods/validateGuideValues.js")
	).default;

	const formData = new FormData(event.target);
	const values = Object.fromEntries(formData);
	const errors = validateGuideValues(values);

	const titleInput = form.querySelector("input[name='title']");
	if (errors.title != null) {
		titleInput.classList.add("error");
	} else {
		titleInput.classList.remove("error");
	}

	// If there are no errors, submit the form.
	if (Object.keys(errors).length > 0) return;

	// Fill in missing values.
	values.people = [];

	// Send the request.
	const response = await request("/api/guide", "POST", values);

	if (!response.ok) {
		console.error(response);
		alert("An error occurred while creating the guide.");
		return;
	}

	// Close the modal.
	/** @type {HTMLDialogElement} */
	const modal = document.getElementById("create-guide-modal");
	modal.close();
	alert("Guide created!");
});
