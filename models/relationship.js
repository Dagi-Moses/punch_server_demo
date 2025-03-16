const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({

  Relationship_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const Relationship = mongoose.model(
  "Relationship",
  relationshipSchema,
  "relationship"
);

module.exports = Relationship;
