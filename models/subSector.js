const mongoose = require("mongoose");

const subSectorSchema = new mongoose.Schema({
 
  sub_sector_id: {
    type: Number,
    required: true,
    unique: true,
  },
  sector_id: {
    type: Number,
    required: true,
  },
  sub_sector_name: {
    type: String,
  },
});

const SubSector = mongoose.model("SubSector", subSectorSchema, "sub_sector");

module.exports = SubSector;
