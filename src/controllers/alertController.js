const Alert = require("../models/Alert");

// Get all alerts for logged-in user
const getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mark a single alert as read
const markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getUserAlerts, markAlertRead };
