

const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
 
  Family_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Client_No: Number,
  Family_Type_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Last_Name: String,
  Other_Names: String,
  Phone: String,
  Mobile: String,
  DOB: Date,
  Address: String,
});

module.exports = mongoose.model("Family", familySchema, "family");
