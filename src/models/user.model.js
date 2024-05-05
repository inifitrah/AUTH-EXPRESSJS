const { mongoose } = require("../db/db");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    username: String,
    refresh_token: String,
    profile_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
