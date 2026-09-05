const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/soma';

let cachedDb = null;

// Reusable connection that can be awaited from any entrypoint (local, Render, Vercel)
async function connectDB() {
    if (cachedDb) return cachedDb;
    const conn = await mongoose.connect(MONGO_URL);
    cachedDb = conn;
    console.log('MongoDB connected');
    return conn;
}

module.exports = connectDB;
