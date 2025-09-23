const express = require("express");
const router = express.Router();
const { registerController, loginController } = require("../controllers/employerController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Example protected routes (optional)
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin content" });
});

module.exports = router;
