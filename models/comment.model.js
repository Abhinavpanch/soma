const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');

const commentsFile = 'comments.json';

class Comment {
    constructor(post, author, content) {
        this.id = uuidv4();
        this.post = post;
        this.author = author;
        this.content = content;
        this.upvotes = 0;
        this.downvotes = 0;
    }

    static findAll() {
        return readJSON(commentsFile);
    }

    static findByPostId(postId) {
        const comments = readJSON(commentsFile);
        return comments.filter(comment => comment.post === postId);
    }

    static create({ post, author, content }) {
        const comments = readJSON(commentsFile);
        const newComment = new Comment(post, author, content);
        comments.push(newComment);
        writeJSON(commentsFile, comments);
        return newComment;
    }
}

module.exports = Comment;