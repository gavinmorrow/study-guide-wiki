const guideId = document.querySelector("meta[name='data-guide-id']").content;

// Connect to the server with websockets
const socket = new WebSocket(`ws://localhost:8080/guide/${guideId}`);
socket.addEventListener("open", () => {
	console.log("Connected to the server");
});

socket.addEventListener("message", msg => {
	console.log("Message from the server:", msg);

	try {
		msg = JSON.parse(msg.data);
	} catch (err) {
		console.error("Invalid message format. Message must be JSON.", msg);
		return;
	}

	switch (msg.type) {
		case "ping":
			socket.send(JSON.stringify({ type: "pong" }));
			break;

		case "error":
			console.error("Error from the server:", msg);
			break;

		default:
			console.error("Invalid message type", msg.type);
	}
});

socket.addEventListener("error", err => {
	console.error("Error from the server:", err);
});

const editor = document.getElementById("editor");
editor.addEventListener("input", () => {
	const content = editor.value;
	console.log(content);
});
