const mongoose = require("mongoose");

const oldAnniversarySchema = new mongoose.Schema({
  Anniversary_No: {
    type: Number,
    required: true,
    unique: true,
  },
  Name: String,
  Anniversary_Type_Id: Number,
  Date: Date,
  Placed_By_Name: String,
  Placed_By_Address: String,
  Placed_By_Phone: String,
  Friends: String,
  Associates: String,
  Paper_Id: Number,
  Description:String,
  Image: {
    type: Buffer, // Store compressed image as a Buffer
    set: (value) => {
      // Automatically convert Base64 string to Buffer
      if (typeof value === "string") {
        return Buffer.from(value, "base64");
      }
      return value;
    },
    get: (value) => {
      // Automatically convert Buffer to Base64 string
      if (value) {
        return value.toString("base64");
      }
      return null;
    },
  }, // Store compressed image

});

// Add a virtual property for Anniversary_Year
oldAnniversarySchema.virtual("Anniversary_Year").get(function () {
  if (!this.Date) return null; // Return null if Date is not set
  const eventYear = new Date(this.Date).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - eventYear; // Calculate the difference in years
});

// Ensure virtuals are included in JSON responses
oldAnniversarySchema.set("toJSON", { virtuals: true , });
oldAnniversarySchema.set("toObject", { virtuals: true,  });

const OldAnniversary = mongoose.model(
  "OldAnniversary",
  oldAnniversarySchema,
  "oldAanniversary"
);

module.exports = OldAnniversary;
