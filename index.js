require("dotenv").config(); // Load environment variables
const connectDB = require("./db");
const app = require("./app");

const port = process.env.PORT || 5001;

// Connect to MongoDB, then start the server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });
