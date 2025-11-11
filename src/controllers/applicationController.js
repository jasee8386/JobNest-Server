const Application = require("../models/Application");
const Job = require("../models/Job");

// 📌 Get logged-in jobseeker’s applications (with company name)
const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title location status employer",
        populate: {
          path: "employer",
          select: "name email profile.employer.companyName", 
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("MyApplications Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { myApplications };
