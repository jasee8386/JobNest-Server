const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createJob, getMyJobs, getJobApplicants } = require("../controllers/employerController");

const router = express.Router();

// Employers only
router.post("/jobs", protect, authorize("employer"), createJob);
router.get("/jobs/my", protect, authorize("employer"), getMyJobs);
router.get("/jobs/:id/applicants", protect, authorize("employer"), getJobApplicants);

module.exports = router;
