const express = require("express");
const app = express();
const PORT = 8080;

// Generate JWT token secret
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
process.env.ACCESS_TOKEN_SECRET = secret;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.send("Hello World!"));
app.post("/login", require("./routes/login"));
app.post("/signup", require("./routes/signup"));
app.get("/protected", require("./routes/authenticate"), (_req, res) => {
    res.send("You are authenticated!");
});

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
