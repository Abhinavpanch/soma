const User = require("../models/user.model");
const Post = require("../models/postFunctions.model");

async function adminDashboard(req, res) {
    try {
        const users = await User.find(); // Fetch all users
        const posts = await Post.find(); // Fetch all posts
        res.render("adminDashboard", { users, posts, user: req.user });
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function manageUser(req, res) {
    try {
        const { userId, action } = req.body;

        if (action === "delete") {
            await User.deleteOne({ _id: userId });
        } else if (action === "edit") {
            const { fullName, email, isAdmin } = req.body;
            await User.updateOne({ _id: userId }, { fullName, email, isAdmin });
        }

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Error managing user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function generateReports(req, res) {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const adminCount = await User.countDocuments({ isAdmin: true });

        res.json({
            userCount,
            postCount,
            adminCount,
        });
    } catch (error) {
        console.error("Error generating reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    adminDashboard,
    manageUser,
    generateReports,
};