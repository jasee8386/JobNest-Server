// routes/jobRoutes.js
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getJobs, getJobById, applyJob } = require("../controllers/jobController");
const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected route (only authenticated job seekers can apply)
router.post("/:id/apply", protect, applyJob);

module.exports = router;
