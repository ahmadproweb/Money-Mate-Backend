const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
