// routes/applicationRoutes.js
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { applyJob, myApplications } = require("../controllers/applicationController");

const router = express.Router();

router.use(protect, authorize("jobseeker"));

router.post("/:jobId/apply", applyJob);
router.get("/my", myApplications);

module.exports = router;
