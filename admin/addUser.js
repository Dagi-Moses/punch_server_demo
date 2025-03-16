
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { auth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        last_name,
        first_name,
        login_id,
        staff_no,
        role,
      } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = new User({
        username,
        password: hashedPassword,
        last_name,
        first_name,
        login_id,
        staff_no,
        role,
      });

      // Save the new user
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
