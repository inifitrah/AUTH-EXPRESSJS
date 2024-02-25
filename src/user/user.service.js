const User = require("../models/user.model");
const bcrypt = require("bcrypt");
async function deleteAccountService(userLogin, userInput) {
  if (!userLogin) {
    return {
      message: "You must log in first",
      status: 401,
    };
  }
  if (!userInput.password) {
    return {
      message: "Password required",
      status: 401,
    };
  }
  try {
    //cek user
    const user = await User.findById(userLogin.userId);
    if (!user) {
      return {
        message: "User not found",
        status: 401,
      };
    }
    // cek password
    const checkedPassword = await bcrypt.compare(
      userInput.password,
      user.password
    );
    if (!checkedPassword) {
      return {
        status: 401,
        message: "Password incorrect",
      };
    }
    await User.findByIdAndDelete(user._id);
    return {
      message: "Successfully deleted account",
      status: 200,
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  deleteAccountService,
};
