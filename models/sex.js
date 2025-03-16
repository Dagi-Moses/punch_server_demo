const mongoose = require("mongoose");

const sexSchema = new mongoose.Schema({
  
  Sex_Code: {
    type: String,
    required: true,
    enum: ["M", "F"],
  },
  Gender: {
    type: String,
  },
});

const Sex = mongoose.model("Sex", sexSchema, "sex");

module.exports = Sex;
