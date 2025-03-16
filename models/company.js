// models/Anniversary.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  Company_No: {
    type: Number,
    unique: true,
    required: true,
  },
  Name: String,
  Company_Sector_Id: Number,
  Date: Date,
  Address: String,
  Email: String,
  Phone: String,
  Fax: String,
  Start_Date: Date,
  Image: {
    type: Buffer, // Store compressed image as a Buffer
    set: (value) => {
      // Automatically convert Base64 string to Buffer
      if (typeof value === "string") {
        return Buffer.from(value, "base64");
      }
      return value;
    },
    get: (value) => {
      // Automatically convert Buffer to Base64 string
      if (value) {
        return value.toString("base64");
      }
      return null;
    },
  }, // Store compressed image
  Description: String, // Description for the image
});






const Company = mongoose.model("Company", companySchema, "company");
module.exports = Company;