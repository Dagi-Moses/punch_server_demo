const mongoose = require("mongoose");

const familyTypeSchema = new mongoose.Schema({
 
  Family_Type_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: String,
});

module.exports = mongoose.model("FamilyType", familyTypeSchema, "family_type");
