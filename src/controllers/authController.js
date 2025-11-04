//register,login
const generateToken = require("../utils/generateToken")
const  User = require("../models/User")
const bcrypt = require('bcrypt');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
//-------REGISTER-------
const registerController = async (req,res)=>{
  try {
    const { name, email, password, role } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Create new user

     let profile = {};

    if (role === "jobseeker") {
      profile = {
        seeker: {
          skills: [],
          experience: "",
          resume: "",
          location: ""
        }
      };
    } else if (role === "employer") {
      profile = {
        employer: {
          companyName: "",
          website: "",
          address: "",
          industry: ""
        }
      };
    } else if (role === "admin") {
      profile = {}; }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker",
      profile
    });

    await newUser.save();

    // 5. Generate JWT token
    const token = generateToken(newUser);

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
  }

//----------LOGIN---------
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = generateToken(user);

    // 4. Send response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {registerController,loginController}    