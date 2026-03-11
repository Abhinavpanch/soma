const express = require("express");
const { adminDashboard, manageUser, generateReports } = require("../controllers/admin.controller");
const { authenticateJWT, authenticateAdmin } = require("../services/auth");

const router = express.Router();

router.get("/dashboard", authenticateJWT, authenticateAdmin, adminDashboard);
router.post("/manageUser", authenticateJWT, authenticateAdmin, manageUser);
router.get("/reports", authenticateJWT, authenticateAdmin, generateReports);

module.exports = router;