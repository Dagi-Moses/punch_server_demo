


const mongoose = require("mongoose");

const currentStaffSchema = new mongoose.Schema({
  
  Staff_No: String,
});

module.exports = mongoose.model(
  "CurrentStaff",
  currentStaffSchema,
  "current_staff"
);
