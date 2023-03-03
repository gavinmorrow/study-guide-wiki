require("./backend/api/authentication/generateTokenSecrets");

const express = require("express");
const app = express();
const PORT = 8080;

const logger = require("./backend/logger");

// Websockets
require("express-ws")(app);
app.ws("/api/echo", (ws, req) => {
	ws.on("message", msg => {
		logger.trace("Message from the client", msg);
		if (msg == "Ping!") ws.send("Pong!");
		else ws.send(msg);
	});
	ws.on("error", err => {
		logger.info("Error from the client", err);
	});

	logger.trace("Connected to the client");
	ws.send("Hello!");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(require("./backend/api/routes/normalizeUrl"));

// Authentication
app.use(require("./backend/api/routes/auth/authenticate"));

// Pug
app.set("views", "./frontend/views");
app.set("view engine", "pug");

// Routes
app.use("/", require("./backend/client/routes/routes")); // Frontend
app.use("/api", require("./backend/api/routes/api")); // API

app.listen(PORT, () => logger.info(`Listening on localhost:${PORT}!`));
