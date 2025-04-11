const mongoose = require('mongoose');

// const { readJSON, writeJSON } = require('../utils/fileUtils');
// const { v4: uuidv4 } = require('uuid');

// const postsFile = 'posts.json';

// class Post {
//     constructor(title, content, genre, author, authorId) {
//         this.id = uuidv4();
//         this.authorId = authorId;
//         this.title = title;
//         this.content = content;
//         this.genre = genre;
//         this.author = author;
//         this.comments = [];
//         this.upvotes = [];
//         this.downvotes = [];
//         this.views = 0;
//     }

//     static upvote(id) {
//         const posts = readJSON(postsFile);
//         const post = posts.find(post => post.id === id);
//         if (post) {
//             post.upvotes++;
//             writeJSON(postsFile, posts);
//         }
//     }

//     static downvote(id) {
//         const posts = readJSON(postsFile);
//         const post = posts.find(post => post.id === id);
//         if (post) {
//             post.downvotes++;
//             writeJSON(postsFile, posts);
//         }
//     }

//     static incrementViews(id) {
//         const posts = readJSON(postsFile);
//         const post = posts.find(post => post.id === id);
//         if (post) {
//             post.views++;
//             writeJSON(postsFile, posts);
//         }
//     }

//     static findAll() {
//         return readJSON(postsFile);
//     }

//     static findByAuthorId(id) {
//         const posts = readJSON(postsFile);
//         return posts.filter(post => post.authorId === id);
//     }

//     static findById(id) {
//         const posts = readJSON(postsFile);
//         return posts.find(post => post.id === id);
//     }

//     static create({ title, content, genre, author, authorId }) {
//         const posts = readJSON(postsFile);
//         const newPost = new Post(title, content, genre, author, authorId);
//         posts.push(newPost);
//         writeJSON(postsFile, posts);
//         return newPost;
//     }

//     static deleteById(id) {
//         let posts = readJSON(postsFile);
//         posts = posts.filter(post => post.id !== id);
//         writeJSON(postsFile, posts);
//     }

//     static addComment(postId, comment) {
//         const posts = readJSON(postsFile);
//         const post = posts.find(post => post.id === postId);
//         if (post) {
//             post.comments.push(comment);
//             writeJSON(postsFile, posts);
//         }
//     }

//     static async update(query, update) {
//         const posts = await readJSON(postsFile);
//         const post = posts.find(post => post.id === query.id);
//         if (post) {
//             if (update.$pull && update.$pull.comments) {
//                 post.comments = post.comments.filter(comment => comment.id !== update.$pull.comments.id);
//             }
//             if (update.$pull && update.$pull.upvotes) {
//                 post.upvotes = post.upvotes.filter(id => id !== update.$pull.upvotes);
//             }
//             if (update.$push && update.$push.upvotes) {
//                 post.upvotes.push(update.$push.upvotes);
//             }
//             if (update.$pull && update.$pull.downvotes) {
//                 post.downvotes = post.downvotes.filter(id => id !== update.$pull.downvotes);
//             }
//             if (update.$push && update.$push.downvotes) {
//                 post.downvotes.push(update.$push.downvotes);
//             }
//             await writeJSON(postsFile, posts);
//         }
//     }

//     static async find(query) {
//         const posts = await readJSON(postsFile);
//         return posts.filter(post => {
//             return query.$or.some(condition => {
//                 const [key, value] = Object.entries(condition)[0];
//                 const regex = new RegExp(value.$regex, value.$options);
//                 return regex.test(post[key]);
//             });
//         });
//     }
// }

// module.exports = Post;

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    genre: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', postSchema);