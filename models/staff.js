const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  
  Staff_No: {
    type: String,
    required: true,
    unique: true,
  },
  Last_Name: {
    type: String,
  },
  First_Name: {
    type: String,
  },
  Middle_Name: String,
  Date_of_Birth: {
    type: Date,
  },
  Sex: {
    type: String,
    enum: ["M", "F"],
  },
  Religion: String,
  Health_Status: String,
  Nationality: String,
  Town_Of_Origin: String,
  State_Of_Origin: String,
  Local_Government_Area: String,
  Former_Last_Name: String,
  Marital_Status: Number,
  No_Of_Children: Number,
  Title: Number,
  Type: Number,
  Level: Number,
  Target: {
    type: mongoose.Schema.Types.Decimal128,
  },
});

const Staff = mongoose.model("Staff", staffSchema, "staff");

module.exports = Staff;
