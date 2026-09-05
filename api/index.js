// Vercel serverless entrypoint — serves the whole Express + EJS app.
// All routes are rewritten to /api by vercel.json; Express sees the
// original request URL and handles routing/views/static as usual.
const app = require("../app");
const connectDB = require("../db");

// Vercel can invoke the function before a cold-start connection is ready.
// Await it so auth requests never depend on Mongoose's query buffering.
module.exports = async function handler(req, res) {
	try {
		await connectDB();
		return app(req, res);
	} catch (error) {
		console.error("MongoDB connection error:", error);
		return res.status(503).json({
			message: "Database unavailable. Check the Vercel MONGO_URL and MongoDB Atlas network access settings."
		});
	}
};
