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

app.get("/", (_req, res) => res.send("Hello World!"));
app.post("/login", require("./routes/login"));
app.post("/signup", require("./routes/signup"));
app.post("/refresh", require("./routes/refresh"));
app.get("/protected", require("./routes/authenticate"), (_req, res) => {
    res.send("You are authenticated!");
});

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
