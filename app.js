require("./backend/authentication/generateTokenSecrets");

const express = require("express");
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());

// Authentication
app.use(require("./backend/routes/auth/authenticate"));

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
app.use("/api", require("./backend/routes/api"));

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}!`));
