// controllers/userController.js
const User = require("../models/User");

// 🔹 Update logged-in user profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Update only allowed fields (optional: you can whitelist)
    const allowedFields = ["name", "email", "profile", "skills", "resume", "location"];
    const filteredUpdates = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) filteredUpdates[field] = updates[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("UpdateProfile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { updateProfile };
