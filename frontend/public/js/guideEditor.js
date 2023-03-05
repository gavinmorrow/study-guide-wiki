const guideId = document.querySelector("meta[name='data-guide-id']").content;

// Connect to the server with websockets
const socket = new WebSocket(`ws://localhost:8080/guide/${guideId}`);
socket.addEventListener("open", () => {
	console.log("Connected to the server");
});

socket.addEventListener("message", msg => {
	console.log("Message from the server:", msg);
});

socket.addEventListener("error", err => {
	console.error("Error from the server:", err);
});

const editor = document.getElementById("editor");
editor.addEventListener("input", () => {
	const content = editor.value;
	console.log(content);
});
