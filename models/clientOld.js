// models/Anniversary.js
const mongoose = require("mongoose");

const sexValidator = (value) => {
  return value === "M" || value === "F";
};
const clientOldSchema = new mongoose.Schema({
  Client_No: Number,
  Title: Number,
  Last_Name: String,
  First_Name: String,
  Middle_Name: String,
  Date_Of_Birth: Date,
  Sex: {
    type: String,
    validate: {
      validator: sexValidator,
      message: "invalid sex type",
    },
  },
  Religion: String,
  Nationality: String,
  State_Of_Origin: Number,
  Town_Of_Origin: String,
  LGA: String,
  Former_Last_Name: String,
  Marital_Status: Number,
  No_Of_Children: Number,
  Trad_Title: String,
});

const ClientOld = mongoose.model("ClientOld", clientOldSchema, "client_old");

module.exports = ClientOld;
