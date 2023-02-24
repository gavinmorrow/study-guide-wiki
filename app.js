require("./backend/authentication/generateTokenSecrets");

const express = require("express");
const app = express();
const PORT = 8080;

const logger = require("./backend/logger");

// Websockets
require("express-ws")(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(require("./backend/routes/normalizeUrl"));

// Authentication
app.use(require("./backend/routes/auth/authenticate"));

// Pug
app.set("views", "./frontend/views");
app.set("view engine", "pug");

// Routes
app.use("/", require("./frontend/routes/routes")); // Frontend
app.use("/api", require("./backend/routes/api")); // API

app.listen(PORT, () => logger.info(`Listening on localhost:${PORT}!`));
