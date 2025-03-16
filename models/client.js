// models/Anniversary.js
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  Client_No: {
    type: Number,
    unique: true,
    required: true,
  },
  Title_Id: Number,

  Last_Name: String,
  First_Name: String,
  Middle_Name: String,
  Date_Of_Birth: Date,
  Telephone: String,
  Email: String,
  Place_Of_Work: String,
  Associates: String,
  Friends: String,
  Address: String,
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

clientSchema.virtual("Age").get(function () {
  if (!this.Date_Of_Birth) return null; // Return null if Date is not set
  const birthDate = new Date(this.Date_Of_Birth);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});


// Ensure virtuals are included in JSON responses
clientSchema.set("toJSON", { virtuals: true , });
clientSchema.set("toObject", { virtuals: true, });

const Client = mongoose.model("Client", clientSchema ,"client");

module.exports = Client;

