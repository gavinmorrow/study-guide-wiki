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
app.use(require("./backend/routes/user/authenticate"));

// Pug
app.set("views", "./frontend/views");
app.set("view engine", "pug");

// Frontend Routes
app.get("/", (req, res) => res.render("homepage", { title: "Studypedia" }));
app.get("/signup", (req, res) =>
	res.render("signup", { title: "Signup | Studypedia" })
);
app.get("/login", (req, res) =>
	res.render("login", { title: "Login | Studypedia" })
);
app.get("/dashboard", (req, res) =>
	res.render("dashboard", { title: "Dashboard | Studypedia" })
);
app.use(express.static("./frontend/public"));

// API Routes
app.get("/api", (_req, res) => res.send("Hello World!"));
app.get("/api/protected", (_req, res) => {
	res.send("You are authenticated!");
});

// User routes
app.post("/api/login", require("./backend/routes/user/login"));
app.post("/api/signup", require("./backend/routes/user/signup"));
app.post("/api/refresh", require("./backend/routes/user/refresh"));
app.get("/api/user", require("./backend/routes/user/user"));
app.get("/api/user/id/:displayName", require("./backend/routes/user/id"));

// Guide routes
const guideRoutes = require("./backend/routes/guide/guide");
app.get("/api/guide/:id", guideRoutes.get);
app.post("/api/guide", guideRoutes.post);
app.delete("/api/guide/:id", guideRoutes.delete);

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
