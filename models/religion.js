const mongoose = require("mongoose");

const religionSchema = new mongoose.Schema({
  
  religion_code: {
    type: String,
    required: true,
    unique: true,
  },
  religion: {
    type: String,
  },
});

const Religion = mongoose.model("Religion", religionSchema, "religion");

module.exports = Religion;
