
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  
  Department_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Centre_Code: String,
  Department_Name: String,
});

module.exports = mongoose.model("Department", departmentSchema, "department");
