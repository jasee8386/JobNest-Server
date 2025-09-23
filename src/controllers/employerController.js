const Job = require("../models/Job");

// Create a job
const createJob = async (req, res) => {
  try {
    const { title, description, requirements, responsibilities, category, location, expiryDate } = req.body;

    const newJob = await Job.create({
      title,
      description,
      requirements,
      responsibilities,
      category,
      location,
      employer: req.user.id,
      isVerified: false,
      applicants: [],
      expiryDate,
    });

    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all jobs posted by employer
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// View applicants for a specific job
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user.id })
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
