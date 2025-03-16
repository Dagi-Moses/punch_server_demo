const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema({
 
  sector_id: {
    type: Number,
    required: true,
    unique: true,
  },
  sector_name: {
    type: String,
  },
});

const Sector = mongoose.model("Sector", sectorSchema, "sector");

module.exports = Sector;
