const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};


const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission Denied" });
    }
    next();
  };
};


module.exports = { auth, authorizeRoles };
