const express = require("express");
const app = express();
const PORT = 8080;

const db = require("./db/db");

app.get("/", (_req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
