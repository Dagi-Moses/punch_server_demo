// models/Anniversary.js
const mongoose = require("mongoose");

const anniversaryTypeSchema = new mongoose.Schema({
 
  Anniversary_Type_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: String,
});



const AnniversaryType = mongoose.model(
  "AnniversaryType",
  anniversaryTypeSchema,
    "anniversary_type"
);

module.exports = AnniversaryType;