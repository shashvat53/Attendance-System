const express = require("express");
const router = express.Router();
const { totalWork } = require("../controllers/attendanceController");

// Define routes
router.post("/workhours", totalWork);

module.exports = router;
