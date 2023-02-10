const express = require("express");
const app = express();
const PORT = 8080;

// Generate JWT token secrets
const crypto = require("crypto");
process.env.ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
process.env.REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
console.log("Access token secret:", process.env.ACCESS_TOKEN_SECRET);
console.log("Refresh token secret:", process.env.REFRESH_TOKEN_SECRET);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Guide routes
const guideRoutes = require("./routes/guide/guide");
app.get("/guide/:id", guideRoutes.get);
app.post("/guide", guideRoutes.post);
app.delete("/guide/id", guideRoutes.delete);

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
