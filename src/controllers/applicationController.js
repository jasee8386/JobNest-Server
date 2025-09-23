const Application = require("../models/Application");
const Job = require("../models/Job");

// 📌 Apply for a job
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resume } = req.body;

    // 1. Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Prevent applying twice
    const existingApp = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // 3. Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume,
    });

    // 4. Push reference into Job model
    job.applicants.push(application._id);
    await job.save();

    res.status(201).json({
      message: "Application submitted successfully",  updatedJob: await Job.findById(jobId).populate("applicants", "name email profile"),
      application,
    });
  } catch (err) {
    console.error("ApplyJob Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📌 Get logged-in jobseeker’s applications
const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location status") // job details
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("MyApplications Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { applyJob, myApplications };

