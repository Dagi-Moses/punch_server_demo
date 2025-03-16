

// models/Anniversary.js
const mongoose = require("mongoose");

const companySectorSchema = new mongoose.Schema({
 
  Company_Sector_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: String,
});

module.exports = mongoose.model(
  "CompanySector",
  companySectorSchema,
  "company_sector"
);
