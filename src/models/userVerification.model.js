const { mongoose } = require("../db/db");

const userVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  created_at: Date,
  expires_at: Date,
});

const UserVerification = new mongoose.model("User", userVerificationSchema);

module.exports = UserVerification;
