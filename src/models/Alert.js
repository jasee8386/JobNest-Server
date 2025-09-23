const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Job Alert", // New job matching seeker’s profile
        "Application Update", // Status change for application
        "Verification Notice", // Admin verification updates
        "System Message", // General platform messages
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Optional link to job
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application", // Optional link to application
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
