require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "Abhi";

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            // Guest mode — expired or invalid cookies shouldn't break public pages
            req.user = null;
            return next();
        }
        req.user = user;
        next();
    });
};

const authenticateAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.log("Unauthorized access attempt by:", req.user ? req.user.email : "Unknown user");
        return res.redirect("/user/login"); // Redirect unauthorized users
    }
    next();
};

module.exports = { authenticateJWT, authenticateAdmin };
