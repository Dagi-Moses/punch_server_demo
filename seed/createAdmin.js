// createAdmin.js

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user"); 

const uri = process.env.MONGO_URI;
const saltRounds = 10;
const defaultAdmin = {
  username: "admin",
  password: "admin", // Change this to your desired password
  last_name: "Admin",
  first_name: "Default",
  login_id: 1,
  staff_no: 1,
  role: "admin",
};

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, saltRounds);
    defaultAdmin.password = hashedPassword;

    const admin = new User(defaultAdmin);
    await admin.save();
    console.log("Default admin created");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
