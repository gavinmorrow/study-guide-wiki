// @ts-ignore (querySelector in this case will return a meta html element, which has a content property)
const guideId = document.querySelector("meta[name='data-guide-id']").content;

// Handle messages from the server
const handleMessage = msg => {
	switch (msg.type) {
		case "ping":
			socket.send(JSON.stringify({ type: "pong" }));
			break;

		case "paragraphUpdated":
			// Update the paragraph
			// @ts-ignore
			document.getElementById(msg.data.paragraphId).value = msg.data.newValue;
			break;

		case "error":
			console.error("Error from the server:", msg);
			break;

		default:
			console.error("Invalid message type", msg.type);
	}
};

// Connect to the server with websockets
const socket = new WebSocket(`ws://localhost:8080/guide/${guideId}`);

socket.addEventListener("open", () => {
	console.log("Connected to the server");
});

socket.addEventListener("error", err => {
	console.error("Error from the server:", err);
});

socket.addEventListener("close", () => {
	console.log("Disconnected from the server");
});

socket.addEventListener("message", msg => {
	console.log("Message from the server:", msg);

	try {
		msg = JSON.parse(msg.data);
	} catch (err) {
		console.error("Invalid message format. Message must be JSON.", msg);
		return;
	}

	handleMessage(msg);
});

// Handle user input
/** @type {NodeListOf<HTMLTextAreaElement>} */
const editors = document.querySelectorAll("main textarea");
for (const textarea of editors) {
	textarea.addEventListener("focus", () => {
		socket.send(
			JSON.stringify({
				type: "lockParagraph",
				data: {
					paragraphId: textarea.id,
				},
			})
		);
	});

	textarea.addEventListener("blur", () => {
		socket.send(
			JSON.stringify({
				// type: "unlockParagraph",
			})
		);
	});

	textarea.addEventListener(
		"input",
		/** @param {InputEvent} e */ e => {
			console.log(e);

			if (e.inputType === "insertLineBreak") {
				// Create a new paragraph
				socket.send(JSON.stringify({ type: "newParagraph" }));
				return;
			}

			socket.send(
				JSON.stringify({
					type: "updateParagraph",
					data: {
						newValue: textarea.value,
					},
				})
			);
		}
	);

	textarea.addEventListener(
		"beforeinput",
		/** @param {InputEvent} e */ e => {
			// Check to see if paragraph should be deleted
			if (textarea.value !== "") return;
			if (e.inputType === "deleteContentBackward") {
				socket.send(JSON.stringify({ type: "deleteParagraph" }));

				// Lock the previous paragraph, if possible
				const prev =
					textarea.parentElement.previousElementSibling?.querySelector("textarea");
				if (prev != null) {
					socket.send(
						JSON.stringify({
							type: "lockParagraph",
							data: {
								paragraphId: prev.id,
							},
						})
					);
					return;
				}
			}

			// Lock the next paragraph, if possible
			const next = textarea.parentElement.nextElementSibling?.querySelector("textarea");
			if (next != null) {
				socket.send(
					JSON.stringify({
						type: "lockParagraph",
						data: {
							paragraphId: next.id,
						},
					})
				);
			}
		}
	);
}
