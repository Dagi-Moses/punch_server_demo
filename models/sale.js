const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({

  Net_Salary_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  Staff_No: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
  },
  month_sale: {
    type: mongoose.Schema.Types.Decimal128,
  },
  Status: {
    type: String,
    required: true,
    enum: ["N", "Y"], // Assuming 'N' and 'Y' are the only valid statuses
  },
});

const Sale = mongoose.model("Sale", saleSchema, "sale");

module.exports = Sale;
