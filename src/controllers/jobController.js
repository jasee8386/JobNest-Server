const Job = require("../models/Job");
const Application = require("../models/Application");

// Get all verified jobs
const getJobs = async (req, res) => {
  try {
       const { search, category, page = 1, limit = 6 } = req.query;

    // ✅ Only verified and open jobs
    const query = { isVerified: true, status: "Open" };

    // 🔍 Search by title, location, or skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // 🏷 Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // 🧾 Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate("employer", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
    });
  } catch (err) {
   console.error("Error fetching jobs:", err);
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
       console.log("🎯 Apply route hit");
    console.log("📦 Job ID:", req.params.id);
    console.log("🧠 User:", req.user?._id);
    const job = await Job.findById(req.params.id);
    if (!job)  {
      console.log("❌ Job not found");
      return res.status(404).json({ message: "Job not found" });
    }

    const userId = req.user._id;
 if (!userId) {
      console.log("❌ req.user missing");
      return res.status(401).json({ message: "Unauthorized user" });
    }

    console.log("✅ Job found:", job.title);
    // Prevent duplicate application
    const existingApp = await Application.findOne({
      job: job._id,
      applicant: userId,
    });
    if (existingApp) {console.log("⚠️ Already applied");
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // Create new application
    const newApplication = await Application.create({
      job: job._id,
      applicant: userId,
      resume: req.body.resume|| "",
      coverLetter: req.body.coverLetter || "",
    });
 console.log("✅ Application created:", newApplication._id);
    // Add reference in job
    job.applicants.push(newApplication._id);
    await job.save();
  console.log("✅ Job updated with applicant");
    res.json({ message: "Application submitted", application: newApplication });
  } catch (err) { console.error("❌ Apply Job Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getJobs, getJobById, applyJob };
