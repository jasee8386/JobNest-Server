const express = require("express");
const router = express.Router();
const { updateProfile, getUserProfile } = require("../controllers/userController")
const { registerController, loginController } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Example protected routes (optional)
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});


// Update logged-in user's profile
router.put("/update", protect, updateProfile);
// Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin content" });
});

module.exports = router;
