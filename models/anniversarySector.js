// models/Anniversary.js
const mongoose = require("mongoose");

const anniversarySectorSchema = new mongoose.Schema({
  
  anniversary_sector_id: {
    type: Number,
    required: true,
    unique: true,
  },
  anniversary_no: Number,
  sub_sector_id: Number,
});

const AnniversarySector = mongoose.model(
  "AnniversarySector",
  anniversarySectorSchema,
  "anniversary_sector"
);

module.exports = AnniversarySector;
