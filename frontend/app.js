const express = require("express");
const app = express();
const PORT = 3000;

app.set("views", "./src/views");
app.set("view engine", "pug");

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

app.use(express.static("public"));

app.listen(PORT, () => console.log("Server started on port 3000"));
