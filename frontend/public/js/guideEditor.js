// Connect to the server with websockets
const socket = new WebSocket("ws://localhost:8080/echo");
socket.addEventListener("open", () => {
	console.log("Connected to the server");
	socket.send("Ping!");
});
socket.addEventListener("message", event => {
	console.log("Message from the server:", event.data);
});
socket.addEventListener("error", event => {
	console.log("Error from the server", event.data);
});

const editor = document.getElementById("editor");
editor.addEventListener("input", () => {
	const content = editor.value;
	console.log(content);
});
