const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorMiddleware");

const {verifyApplication ,
  getAllUsers,
  deleteUser,
  getAllJobs,
  verifyJob,
  deleteJob,
  getAllApplications,verifyUser
} = require("../controllers/adminController");

const router = express.Router();

// Protect & authorize admin routes
router.use(protect, authorize("admin"));

// 🔹 User management
router.get("/users", asyncHandler(getAllUsers));
router.delete("/user/:id", asyncHandler(deleteUser));
router.patch("/user/:id/verify", asyncHandler(verifyUser)); // <-- add this

// 🔹 Job management
router.get("/jobs", asyncHandler(getAllJobs));
router.patch("/job/:id/verify", asyncHandler(verifyJob));
router.delete("/job/:id", asyncHandler(deleteJob));

// 🔹 Application management
router.get("/applications", asyncHandler(getAllApplications));
router.patch("/application/:id/verify", asyncHandler(verifyApplication));
module.exports = router;
