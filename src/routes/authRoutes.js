const express = require("express")
const router = express.Router()
const {registerController,loginController } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
//Routes
router.post("/register",registerController)
router.post("/login",loginController)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;