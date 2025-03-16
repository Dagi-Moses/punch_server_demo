const mongoose = require("mongoose");

const anniversarySchema = new mongoose.Schema({
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
  Description: String, // Description for the image
});

// Add a virtual property for Anniversary_Year
anniversarySchema.virtual("Anniversary_Year").get(function () {
  if (!this.Date) return null; // Return null if Date is not set
  const eventYear = new Date(this.Date).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - eventYear; // Calculate the difference in years
});

// Ensure virtuals are included in JSON responses
anniversarySchema.set("toJSON", { virtuals: true , });
anniversarySchema.set("toObject", { virtuals: true,  });

const Anniversary = mongoose.model(
  "Anniversary",
  anniversarySchema,
  "anniversary"
);

module.exports = Anniversary;