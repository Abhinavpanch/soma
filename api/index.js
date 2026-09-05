// Vercel serverless entrypoint — serves the whole Express + EJS app.
// All routes are rewritten to /api by vercel.json; Express sees the
// original request URL and handles routing/views/static as usual.
const app = require("../app");
const connectDB = require("../db");

// Kick off MongoDB at cold start. db.js caches the connection promise,
// and mongoose buffers queries until the connection resolves.
connectDB().catch((err) => console.error("MongoDB connect error:", err));

module.exports = app;
