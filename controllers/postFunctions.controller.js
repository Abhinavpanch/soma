const Post = require('../models/postFunctions.model');
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const connectDB = require("../db");

async function handleHomePage(req, res) {
    try {
        await connectDB();
        const posts = await Post.find().sort({ createdAt: -1 }); // Fetch posts in reverse chronological order
        const user = req.user || null;

        return res.render("home", { posts, message: "Welcome to Soma", user });
    } catch (error) {
        console.error("Error fetching posts:", error);
        // Keep the public home page available when the posts database is temporarily unavailable.
        return res.render("home", {
            posts: [],
            message: "Welcome to Soma",
            user: req.user || null,
            databaseUnavailable: true,
        });
    }
}

async function getMyPost(req, res) {
    try {
        await connectDB();
        const posts = await Post.find({ authorId: req.user.id }).sort({ createdAt: -1 });
        return res.render("home", { posts, message: "Your Posts", user: req.user });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getPostPage(req, res) {
    return res.render("addPost", { user: req.user });
}

async function addPost(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user data' });
    }

    try {
        await connectDB();
        const { title, content, genre } = req.body;

        const post = await Post.create({
            title,
            content,
            genre,
            author: req.user.fullName,
            authorId: req.user.id,
        });

        return res.redirect(303, '/');
    } catch (error) {
        console.error('Error Creating Post:', error);
        return res.status(500).send('Server error');
    }
}

async function showPost(req, res) {
    try {
        await connectDB();
        const postId = req.params.id;

        const post = await Post.findById(postId).populate('comments'); // Populate comments
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await incrementViews(postId); // Increment views

        res.render("showPost", { post, comments: post.comments, user: req.user || null });
    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function incrementViews(postId) {
    try {
        await Post.updateOne({ _id: postId }, { $inc: { views: 1 } });
    } catch (error) {
        console.error("Error incrementing views:", error);
    }
}

async function deletePost(req, res) {
    try {
        await connectDB();
        const postId = req.params.id;

        const result = await Post.deleteOne({ _id: postId, authorId: req.user.id });
        if (result.deletedCount === 0) {
            const post = await Post.exists({ _id: postId });
            return res.status(post ? 403 : 404).json({
                message: post ? "Unauthorized to delete this post" : "Post not found",
            });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function addComment(req, res) {
    try {
        await connectDB();
        const postId = req.params.id;
        const { content } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user.fullName,
            content,
            authorId: req.user.id,
        });

        await Post.updateOne({ _id: postId }, { $push: { comments: comment._id } });

        return res.redirect(303, `/posts/${postId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteComment(req, res) {
    try {
        await connectDB();
        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await Comment.deleteOne({ _id: commentId });
        await Post.updateOne({ _id: postId }, { $pull: { comments: commentId } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function searchPost(req, res) {
    try {
        const searchInput = req.body.searchInput;
        if (!searchInput) {
            return res.status(400).json({ message: 'searchInput is required' });
        }

        const results = await Post.find({
            $or: [
                { title: { $regex: searchInput, $options: 'i' } },
                { content: { $regex: searchInput, $options: 'i' } },
            ],
        });

        res.render('search', {
            results,
            searchInput,
            user: req.user || null,
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function upvotePost(req, res) {
    try {
        await connectDB();
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const hasUpvoted = post.upvotes.some((id) => String(id) === String(userId));

        if (hasUpvoted) {
            await Post.updateOne({ _id: postId }, { $pull: { upvotes: userId } });
        } else {
            await Post.updateOne({ _id: postId }, { $addToSet: { upvotes: userId } });
        }

        return res.redirect(303, `/posts/${postId}`);
    } catch (error) {
        console.error('Error upvoting post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function downvotePost(req, res) {
    try {
        await connectDB();
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const hasDownvoted = post.downvotes.some((id) => String(id) === String(userId));

        if (hasDownvoted) {
            await Post.updateOne({ _id: postId }, { $pull: { downvotes: userId } });
        } else {
            await Post.updateOne({ _id: postId }, { $addToSet: { downvotes: userId } });
        }

        return res.redirect(303, `/posts/${postId}`);
    } catch (error) {
        console.error('Error downvoting post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// function deleteComment(commentId, postId, authorId) {
//     console.log(
//         `Attempting to delete comment: ${commentId} from post: ${postId} with author ID: ${authorId}`
//     );

//     if (!confirm("Are you sure you want to delete this comment?")) return;

//     fetch(`/posts/${postId}/comment/${commentId}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // Ensures cookies are sent with the request
//     })
//         .then((response) => response.json()) // Parse JSON response
//         .then((data) => {
//             console.log("Server response:", data);

//             if (data.message === "Comment deleted successfully") {
//                 document.getElementById(`comment-${commentId}`).remove();
//                 document.getElementById("comment-length").innerText = `Comments (${
//                     document.getElementsByClassName("comment").length
//                 })`;
//                 console.log(`Comment ${commentId} deleted successfully`);
//             } else {
//                 alert(data.message || "Failed to delete comment.");
//             }
//         })
//         .catch((error) => console.error("Error:", error));
// }

module.exports = {
    handleHomePage,
    getMyPost,
    getPostPage,
    addPost,
    showPost,
    deletePost,
    addComment,
    deleteComment,
    searchPost,
    upvotePost,
    downvotePost,
};
