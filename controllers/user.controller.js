const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/postFunctions.model");

const SECRET_KEY = process.env.JWT_SECRET || process.env.SECRET_KEY || "Abhi";

function handleUserSignup(req, res) {
    return res.render("signup");
}

function handleUserLogin(req, res) {
    return res.render("login");
}

function handleUserLogout(req, res) {
    res.clearCookie("token");
    return res.redirect("/user/login");
}

async function createUser(req, res) {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        return res.redirect("/user/login");
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function verifyUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        return res.redirect("/");
    } catch (error) {
        console.error("Error during login:", error);

        // If the DB itself is unreachable, tell the frontend it is a
        // connection issue rather than a generic "Internal Server Error",
        // while still logging the full error in Vercel.
        const isConnectionFailure =
            error &&
            (String(error).includes("CONNECTION_HARD") ||
             String(error).includes("MongooseServerSelectionError") ||
             String(error).includes("connect error"));

        return res.status(503).json({
            message: isConnectionFailure
                ? "Service temporarily unavailable — the database is not reachable right now. Please try again in a moment."
                : "Internal Server Error"
        });
    }
}

function handleUserForgot(req, res) {
    res.render("forgot");
}

async function showUserPost(req, res) {
    try {
        if (!req.user || !req.user.id) {
            console.error("User not authenticated");
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const posts = await Post.find({ authorId: req.user.id });
        res.render("myPosts", { posts, user: req.user });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function showProfile(req, res) {
    try {
        if (!req.user || !req.user.id) {
            console.error("User not authenticated");
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.render("profile", { user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function editProfile(req, res) {
    try {
        if (!req.user || !req.user.id) {
            console.error("User not authenticated");
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.render("editProfile", { user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function updateProfile(req, res) {
    const { inputUsername, inputEmailAddress, profilePicture } = req.body;
    try {
        if (!req.user || !req.user.id) {
            console.error("User not authenticated");
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = inputUsername || user.fullName;
        user.email = inputEmailAddress || user.email;
        user.picture = profilePicture || user.picture;

        await user.save();

        res.redirect("/user/profile");
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserForgot,
    handleUserLogout,
    createUser,
    verifyUser,
    showUserPost,
    showProfile,
    editProfile,
    updateProfile,
};