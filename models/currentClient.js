
const mongoose = require("mongoose");

const currentClientSchema = new mongoose.Schema({

  Client_No: Number,
});

module.exports = mongoose.model(
  "CurrentClient",
  currentClientSchema,
  "current_client"
);
