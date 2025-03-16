const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  last_name: String,

  first_name: String,

  login_id: Number,

  staff_no: {
    type: Number,

    unique: true,
  },

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
  Description: String, // Description fo
});


// Ensure virtuals are included in JSON responses
userSchema.set("toJSON", { getters: true });
userSchema.set("toObject", { getters: true });

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
