const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Links to the job being applied for
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Job seeker who applied
      required: true,
    },
    coverLetter: {
      type: String,
      default: "",
    },
    resume: {
      type: String, 
     default:"",
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Interview", "Rejected", "Hired"],
      default: "Pending",
    },
    employerNotes: {
      type: String,
      default: "",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
