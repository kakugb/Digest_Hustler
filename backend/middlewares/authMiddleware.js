const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access restricted to admins only" });
  }
  next();
};
