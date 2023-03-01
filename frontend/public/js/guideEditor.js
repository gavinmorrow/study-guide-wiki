const guideId = document.getElementById("data-guide-id").value;

// Connect to the server with websockets
const socket = new WebSocket(`ws://localhost:8080/api/guide/${guideId}`);

const editor = document.getElementById("editor");
editor.addEventListener("input", () => {
	const content = editor.value;
	console.log(content);
});
