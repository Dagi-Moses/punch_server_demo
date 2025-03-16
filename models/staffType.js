const mongoose = require("mongoose");

const staffTypeSchema = new mongoose.Schema({

  Type_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const StaffType = mongoose.model("StaffType", staffTypeSchema, "staff_type");

module.exports = StaffType;
