const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Employer, Seeker, or Admin
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Optional — link to a job if chat is about a job
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
