// models/Anniversary.js
const mongoose = require("mongoose");

const clientExtraSchema = new mongoose.Schema({
  Client_No: {
    type: Number,
 required: true,
    unique: true,
  },
  Political_Party: String,
  Present_Position: String,
  Hobbies: String,
  Companies: String,
});

const ClientExtra = mongoose.model(
  "ClientExtra",
  clientExtraSchema,
  "client_extra"
);

module.exports = ClientExtra;