const { mongoose } = require("../db/db");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  created_at: Date,
  updated_at: Date,
});

const User = new mongoose.model("User", userSchema);

module.exports = User