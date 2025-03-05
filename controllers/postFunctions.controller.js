const Post = require("../models/postFunctions.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

async function handleHomePage(req, res) {
    try {
        const posts = Post.findAll();
        const user = req.user || null;

        return res.render("home", { posts, message: "Welcome to Soma", user });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.redirect("/user/login");
    }
}

async function getPostPage(req, res) {
    return res.render("addPost");
}

async function addPost(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    try {
        const { title, content, genre } = req.body;

        const post = Post.create({
            title,
            content,
            genre,
            author: req.user.fullName,
            authorId: req.user.id,
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Error Creating Post:", error);
        return res.status(500).send("Server error");
    }
}

async function showPost(req, res) {
    try {
        const postId = req.params.id;

        const post = Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = Comment.findByPostId(postId);

        res.render("showPost", { post, comments, user: req.user || null });
    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        Post.deleteById(postId);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function addComment(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { content } = req.body;
        const postId = req.params.id;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const newComment = Comment.create({
            content,
            post: postId,
            author: req.user.fullName,
        });

        Post.addComment(postId, newComment);
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {
    getPostPage,
    addPost,
    showPost,
    deletePost,
    handleHomePage,
    addComment,
};