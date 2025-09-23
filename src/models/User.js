const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "employer", "jobseeker"],
      default: "jobseeker",
    },
    profile: {
      // For Job Seekers
      seeker: {
        resume: { type: String }, // File path or URL
        skills: [{ type: String }],
        experience: { type: Number }, // years
        bio: { type: String },
      },

      // For Employers
      employer: {
        companyName: { type: String },
        companyWebsite: { type: String },
        companyDescription: { type: String },
      },
    },
    isVerified: { type: Boolean, default: false }, // For admin verification
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
