const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  
  State_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  State: {
    type: String,
  },
});

const State = mongoose.model("State", stateSchema, "state");

module.exports = State;
