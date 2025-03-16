const mongoose = require("mongoose");

const staffLevelSchema = new mongoose.Schema({

  Staff_Level_No: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
  },
});

const StaffLevel = mongoose.model("StaffLevel", staffLevelSchema, "staff_level");

module.exports = StaffLevel;
