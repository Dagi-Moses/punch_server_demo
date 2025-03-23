// models/Anniversary.js
const mongoose = require("mongoose");

const companyExtraSchema = new mongoose.Schema({
  Company_No: {
    type: Number,
    unique: true,
    required: true,
  },
  Managing_Director: String,
  Corporate_Affairs: String,
  Media_Manager: String,
  Friends: String,
  Competitors: String,
  Directors: String,
});




const CompanyExtra = mongoose.model(
  "CompanyExtra",
  companyExtraSchema,
  "company_extra"
);
module.exports = CompanyExtra;