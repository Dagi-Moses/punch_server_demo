const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");// Adjust the path as needed
require("dotenv").config();
const createDefaultAdmin = async () => {
    
  try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");
      }
    const defaultAdmin = {
      username: "admin",
      password: "admin", // Change this in production!
      first_name: "Default",
      last_name: "Admin",
      login_id: 1,
      staff_no: 1001,
    };

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      username: defaultAdmin.username,
    });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);

    // Create new admin user
    const newAdmin = new User({
      ...defaultAdmin,
      password: hashedPassword, // Store hashed password
    });

    await newAdmin.save();
    console.log("Default admin created successfully.");
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// Call the function on startup
createDefaultAdmin();


