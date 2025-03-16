const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/user");// Adjust the path as needed

const SECRET_KEY = "your_jwt_secret";

router.post("/", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .send({ isValid: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.user._id; // Assuming the user ID is part of the token payload

    // Fetch user data from your data source
    const user = await User.findById(userId).exec();

    if (!user) {
      return res
        .status(404)
        .send({ isValid: false, message: "User not found" });
    }

    // Remove sensitive data before sending the response
    const userResponse = {
      username: user.username,
      last_name: user.last_name,
      first_name: user.first_name,
      login_id: user.login_id,
      staff_no: user.staff_no,
      role: user.role,
      token: token,
    };

    res.send({ isValid: true, user: userResponse });
  } catch (error) {
    console.error("Token verification or user fetching failed:", error);
    res.status(401).send({ isValid: true, message: "Invalid token" });
  }
});

module.exports = router;
