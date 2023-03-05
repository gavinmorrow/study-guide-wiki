const changeTitle = async newTitle => {
	const request = (await import("./methods/request.js")).default;
	console.log(`Changing title to ${newTitle}`);

	const id = document.querySelector("meta[name='data-guide-id']").getAttribute("content");

	const response = await request("/api/guide", "PATCH", {
		id,
		newTitle,
	});
	if (!response.ok) {
		console.error("Failed to change title");
		return;
	}
};

const titleInput = document.getElementById("guide-title-input");

// Timeouts so it doesn't send a request every time the user types a letter
let lastChangeTimeout;
titleInput.addEventListener("input", () => {
	clearTimeout(lastChangeTimeout);
	lastChangeTimeout = setTimeout(() => {
		changeTitle(titleInput.value);
	}, 1000);
});
