const express = require("express");
const app = express();
const PORT = 8080;

// Generate JWT token secret
const secret = crypto.randomBytes(64).toString("hex");
process.env.ACCESS_TOKEN_SECRET = secret;

app.get("/", (_req, res) => res.send("Hello World!"));
app.post("/login", require("./routes/login"));

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
