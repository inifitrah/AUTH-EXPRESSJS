const User = require("../models/user.model");

const checkUserPermissionMiddleware = async (req, res, next) => {
  try {
    //opsional
    //action signup OR forgot password
    const { email, action } = req.body;
    if (action === "signup") {
      const user = await User.findOne({ email });
      if (user) throw new Error("User allready! Please login.");
    } else if (action === "forgot-password") {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found!");
    }
    next();
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

module.exports = checkUserPermissionMiddleware;
