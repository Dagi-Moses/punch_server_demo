const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
 
  Paper_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const Paper = mongoose.model("Paper", paperSchema, "paper");

module.exports = Paper;
