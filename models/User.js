const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  age: Number,
  retirementAge: Number,
  phoneNumber: String,
  country: String,
  verified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);
