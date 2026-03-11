// filepath: /home/anon/Desktop/3663-431B/Desktop/linux/Workspace/soma/backend/createAdmin.js
require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/soma";

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        // Create a new admin user
        const admin = new User({
            fullName: "Admin User",
            email: "admin@example.com",
            password: await bcrypt.hash("Admin@123", 10), // Strong password
            isAdmin: true,
        });

        await admin.save();
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

createAdmin();