const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

// Generate JWT token secrets
const crypto = require("crypto");
const dev = process.env.NODE_ENV === "development";
process.env.ACCESS_TOKEN_SECRET = dev
	? "access"
	: crypto.randomBytes(64).toString("hex");
process.env.REFRESH_TOKEN_SECRET = dev
	? "refresh"
	: crypto.randomBytes(64).toString("hex");
console.log("Access token secret:", process.env.ACCESS_TOKEN_SECRET);
console.log("Refresh token secret:", process.env.REFRESH_TOKEN_SECRET);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Authentication
app.use(require("./routes/user/authenticate"));

// Routes
app.get("/", (_req, res) => res.send("Hello World!"));
app.get("/protected", (_req, res) => {
	res.send("You are authenticated!");
});

// User routes
app.post("/login", require("./routes/user/login"));
app.post("/signup", require("./routes/user/signup"));
app.post("/refresh", require("./routes/user/refresh"));
app.get("/user", require("./routes/user/user"));
app.get("/user/:displayName", require("./routes/user/id"));

// Guide routes
const guideRoutes = require("./routes/guide/guide");
app.get("/guide/:id", guideRoutes.get);
app.post("/guide", guideRoutes.post);
app.delete("/guide/:id", guideRoutes.delete);

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
