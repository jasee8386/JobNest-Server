const Job = require("../models/Job");
const Alert = require("../models/Alert");
const User = require("../models/User");
// Create a job
const createJob = async (req, res) => {
    try {
    console.log("🟢 Job creation request body:", req.body);
    console.log("🟢 Authenticated user:", req.user);

    const {
      title,
      description,
      requirements,
      category,
      location,
      expiryDate,
    } = req.body;

    const job = new Job({
      title,
      description,
      requirements,
      category,
      location,
      expiryDate,
      employer: req.user._id, 
    });

    await job.save();
    // ✅ Create alerts for matching seekers
    const matchingSeekers = await User.find({
      role: "seeker",
      skills: { $in: requirements },
    });

    const alerts = matchingSeekers.map(seeker => ({
      recipient: seeker._id,
      type: "Job Alert",
      message: `New job posted: ${title}`,
      relatedJob: job._id,
    }));

if (alerts.length) await Alert.insertMany(alerts); 
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("❌ Job creation failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs posted by employer
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// View applicants for a specific job
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id })
      .populate({
        path: "applicants",
        populate: { path: "applicant", select: "name email profile" }, // applicant details
      });

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json(job.applicants); // returns Application objects
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createJob, getMyJobs, getJobApplicants };
