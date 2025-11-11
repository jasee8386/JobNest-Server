//Auth verification
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
        console.log("🔍 decoded payload:", decoded);
      console.log("🔍 DB user role:", user.role);
      if (!user) {
  return res.status(401).json({ message: "User not found" });
}

// attach DB user but keep token role (just in case)
req.user = {
  ...user.toObject(),
  role: user.role || decoded.role
};
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("authorize check:", req.user.role);
        console.log("authorize check:", req.user && req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
module.exports = { protect,authorize  };
