// models/Anniversary.js
const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
 
  country_code: String,
  Country: String,
});

module.exports = mongoose.model("Country", countrySchema, "country");
