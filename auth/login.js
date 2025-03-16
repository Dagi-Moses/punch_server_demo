const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust the path as needed
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


router.post("/", async (req, res) => {
  try {
    console.log('logging in');
    // Trim the username and password
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    console.log("Login attempt:", { username, password });

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User found:", user);

    // Compare the password directly (plain text comparison)
   const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch) {
     console.log("Password mismatch");
     return res.status(400).json({ message: "Invalid password" });
   }
const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
  expiresIn: "12h",
});
    // Create and sign a JWT token
    

    res.status(200).json({ token, user: user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
