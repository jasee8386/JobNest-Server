const Job = require("../models/Job");
const Application = require("../models/Application");

// Get all verified jobs
const getJobs = async (req, res) => {
  try {
      const { search } = req.query;
    let query = { isVerified: true, status: "Open" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(search, "i")] } },
      ];
    }
    
    const jobs = await Job.find({ isVerified: true, status: "Open" });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Apply to a job
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const userId = req.user.id;

    // Prevent duplicate application
    const existingApp = await Application.findOne({
      job: job._id,
      applicant: userId,
    });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // Create new application
    const newApplication = await Application.create({
      job: job._id,
      applicant: userId,
      resume: req.body.resume, // resume URL/path from frontend
      coverLetter: req.body.coverLetter || "",
    });

    // Add reference in job
    job.applicants.push(newApplication._id);
    await job.save();

    res.json({ message: "Application submitted", application: newApplication });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getJobs, getJobById, applyJob };
