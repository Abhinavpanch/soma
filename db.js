const mongoose = require('mongoose');

const raw = process.env.MONGO_URL;
const MONGO_URL = raw || 'mongodb://localhost:27017/soma';

// Mask the password for safe logging (mongodb+srv://user:pass@host/...)
const masked = raw
  ? raw.replace(/^(mongodb(\+srv)?:\/\/[^:]+):[^@]+(@.+)$/, '$1:****$2')
  : 'NOT SET';
console.log(`[db] MONGO_URL ${raw ? 'set' : 'NOT SET'}: ${masked}`);

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  const opts = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(MONGO_URL, opts);
    cachedDb = conn;
    console.log('[db] MongoDB connected');
    return conn;
  } catch (err) {
    console.error('[db] MongoDB connection FAILED:', err.message);
    console.error('[db] Full URI (check Vercel env vars):', masked);
    throw err;
  }
}

module.exports = connectDB;
