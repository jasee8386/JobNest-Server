const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { myApplications } = require("../controllers/applicationController");
const { updateProfile } = require("../controllers/userController");
router.get("/dashboard", protect, authorize("jobseeker"), (req, res) => {
  res.json({ message: "Welcome to the Jobseeker Dashboard" });
});
router.get("/applications", protect, authorize("jobseeker"), myApplications);
router.put("/profile", protect, authorize("jobseeker"), updateProfile);

module.exports = router;
