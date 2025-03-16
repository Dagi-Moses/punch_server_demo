const mongoose = require("mongoose");

const maritalStatusSchema = new mongoose.Schema({
 
  Status_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
  },
});

const MaritalStatus = mongoose.model(
  "MaritalStatus",
  maritalStatusSchema,
  "marital_status"
);

module.exports = MaritalStatus;
