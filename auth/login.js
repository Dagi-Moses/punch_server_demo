const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust the path as needed
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


// router.post("/", async (req, res) => {
//   try {
//     console.log('logging in');
 
//     const username = req.body.username.trim();
//     const password = req.body.password.trim();

//     console.log("Login attempt:", { username, password });

   
//     const user = await User.findOne({ username });

//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ message: "User not found" });
//     }

//     console.log("User found:", user);

//    const isMatch = await bcrypt.compare(password, user.password);

//    if (!isMatch) {
//      console.log("Password mismatch");
//      return res.status(400).json({ message: "Invalid password" });
//    }
// const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
//   expiresIn: "12h",
// });
//     // Create and sign a JWT token
    

//     res.status(200).json({ token, user: user });
//   } catch (error) {
//     console.error("Login error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });



router.post("/", async (req, res) => {
  try {
    console.log("Logging in...");

    // Trim username and password
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    console.log("Login attempt:", { username });

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("User found:", user.username);

    // Compare passwords using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create JWT payload (exclude sensitive fields)
    const payload = {
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      login_id: user.login_id,
      staff_no: user.staff_no,
    };

    // Sign JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // Remove password before sending response
    const { password: _, ...userData } = user.toObject();

    console.log("Login successful:", userData);

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;
