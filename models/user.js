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

  
});


// Ensure virtuals are included in JSON responses
userSchema.set("toJSON", { getters: true });
userSchema.set("toObject", { getters: true });

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
