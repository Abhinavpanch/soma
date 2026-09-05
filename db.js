const mongoose = require('mongoose');

const raw = process.env.MONGO_URL;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const MONGO_URL = raw || (isProduction ? null : 'mongodb://localhost:27017/soma');

// Mask the password for safe logging (mongodb+srv://user:pass@host/...)
// Replace only the password between : and @, keeps the rest intact.
const masked = raw
  ? raw.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1****$2')
  : 'NOT SET';
console.log(`[db] MONGO_URL ${raw ? 'set' : 'NOT SET'}: ${masked}`);

let cachedDbPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (cachedDbPromise && mongoose.connection.readyState === 2) return cachedDbPromise;
  cachedDbPromise = null;

  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not configured for the deployed application');
  }

  const opts = {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 90000,
  };

  cachedDbPromise = mongoose.connect(MONGO_URL, opts)
    .then((conn) => {
      console.log('[db] MongoDB connected');
      return conn;
    })
    .catch((err) => {
    // Surface the real driver-level reason so the next log line tells us
    // whether it is Auth, Network (Atlas IP allowlist), DNS, or timeout.
    const driverReason =
      err && err.reason ? err.reason : err && err.message ? err.message : String(err);

    console.error('[db] MongoDB connection FAILED:', err.message);
    console.error('[db] Driver reason:', driverReason);
    console.error('[db] Full URI (check Vercel env vars):', masked);
    cachedDbPromise = null;
    throw err;
    });

  return cachedDbPromise;
}

module.exports = connectDB;
