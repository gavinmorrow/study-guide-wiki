const express = require("express");
const app = express();
const PORT = 8080;

const db = require("./db/db");

app.get("/", (_req, res) => res.send("Hello World!"));
app.get("/now", async (_req, res) => {
    const date = await db.one("SELECT now()");
    res.send(date.now);
});

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
