require("dotenv").config(); // Load environment variables
const connectDB = require('./db'); // MongoDB connection
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path"); // Ensure path is imported
const userRoute = require("./routes/user.route");
const postFunctionRoute = require("./routes/postFunctions.route");
const adminRoute = require("./routes/admin.route");
const { authenticateJWT } = require("./services/auth");
const { handleHomePage } = require("./controllers/postFunctions.controller");

const app = express();
const port = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", authenticateJWT, handleHomePage);
app.use("/posts", postFunctionRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
