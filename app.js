require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const userRoute = require("./routes/user.route");
const postFunctionRoute = require("./routes/postFunctions.route");
const adminRoute = require("./routes/admin.route");
const { authenticateJWT } = require("./services/auth");
const { handleHomePage } = require("./controllers/postFunctions.controller");

// Resolve the project root regardless of where the platform places files
// (plain `__dirname` locally/Render, function bundle on Vercel).
const PROJECT_ROOT = fs.existsSync(path.join(__dirname, "views"))
  ? __dirname
  : process.cwd();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(PROJECT_ROOT, "views"));

// Serve static assets (theme.css, images) — required on every host
app.use(express.static(path.join(PROJECT_ROOT, "public")));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", authenticateJWT, handleHomePage);
app.use("/posts", postFunctionRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

module.exports = app;
