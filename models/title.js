const mongoose = require("mongoose");

const titleSchema = new mongoose.Schema({
  
  Title_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: String,
  
});

const Title = mongoose.model("Title", titleSchema, "title");

module.exports = Title;
