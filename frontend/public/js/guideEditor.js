const guideId = document.querySelector("meta[name='data-guide-id']").content;

// Connect to the server with websockets
const socket = new WebSocket(`ws://localhost:8080/guide/${guideId}`);
socket.addEventListener("open", () => {
	console.log("Connected to the server");

	socket.send(JSON.stringify({ type: "ping" }));
});
socket.addEventListener("message", msg => {
	console.log("Message from the server:", msg);
});
socket.addEventListener("error", err => {
	console.error("Error from the server:", err);
});
console.log(socket);
setInterval(() => socket.send(JSON.stringify({ type: "ping" })), 1000 * 60);

const editor = document.getElementById("editor");
editor.addEventListener("input", () => {
	const content = editor.value;
	console.log(content);
});
