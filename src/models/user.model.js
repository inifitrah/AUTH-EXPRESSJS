const { mongoose } = require("../db/db");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  createdAt: Date,
  updatedAt: Date,
  verified: Boolean,
  verificationCode: String,
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
