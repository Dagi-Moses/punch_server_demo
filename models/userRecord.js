const mongoose = require("mongoose");

const userRecordSchema = new mongoose.Schema({
  // _id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  Record_Id: {
    type: Number,
    required: true,
    unique: true,
  },
  staff_no: {
    type: Number,
  },
  login_date_time: {
    type: Date,
  },
  computer_name: String,
});

const UserRecord = mongoose.model("UserRecord", userRecordSchema, "user_record");

module.exports = UserRecord;
