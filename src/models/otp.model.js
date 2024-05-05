const { mongoose } = require("../db/db");

const OtpSchema = new mongoose.Schema(
  {
    user_email: String,
    otp: String,
  },
  { timestamps: true }
);

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: "5m" });
const Otp = new mongoose.model("CodeOtp", OtpSchema);

module.exports = Otp;
