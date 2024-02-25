const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const mail = require("../utils/mail");
const TWENTY_FOUR_HOURS = 86400;

async function authLoginService(errors, userInput) {
  if (!errors.isEmpty()) {
    return {
      status: 401,
      message: "Email invalid",
    };
  }
  try {
    //cek email
    const user = await User.findOne({ email: userInput.email });
    if (!user) {
      return {
        status: 401,
        message: "User not found or password incorrect",
      };
    }
    // cek password
    const isMatch = await bcrypt.compare(userInput.password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        message: "Password incorrect",
      };
    }
    // generate token
    const { _id, email } = user;
    const token = jwt.sign({ userId: _id, email }, SECRET_KEY, {
      expiresIn: TWENTY_FOUR_HOURS,
    });
    return {
      status: 200,
      message: "Authenticated successfully",
      token,
      data: user,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function authSignupService(errors, userInput) {
  if (!errors.isEmpty()) {
    return {
      status: 401,
      message: "Email invalid",
    };
  }
  try {
    //cek email
    const user = await User.findOne({ email: userInput.email });
    if (!user) {
      return {
        status: 401,
        message: "User not found",
      };
    }
    // cek password
    const isMatch = await bcrypt.compare(userInput.password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        message: "Password incorrect",
      };
    }
    // generate token
    const { _id, email } = user;
    const token = jwt.sign({ userId: _id, email }, SECRET_KEY, {
      expiresIn: TWENTY_FOUR_HOURS,
    });
    return {
      status: 200,
      message: "Authenticated successfully",
      token,
      data: user,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function forgotPasswordService(errors, userInput) {
  if (!errors.isEmpty()) {
    return {
      status: 401,
      message: "Email invalid",
    };
  }
  try {
    //generate verification code
    const verificationCode = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();
    console.log(verificationCode);
    //cek email and update verification code
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 5);
    const user = await User.findOneAndUpdate(
      { email: userInput.email },
      { verificationCode: hashedVerificationCode },
      { new: true }
    );
    if (!user) {
      return {
        status: 401,
        message: "User not found!",
      };
    }
    await user.save();
    const message = {
      from: {
        name: "TRAH TECH",
        address: "trah@gmail.com",
      },
      to: {
        name: user.email,
        address: user.email,
      },
      subject: "Verifikasi email",
      text: `Kode verifikasi anda ${verificationCode}`,
    };

    // send mail using nodemailer
    const sendMail = await mail(message);
    return {
      status: 200,
      message: sendMail,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function verifyCodeService(errors, userInput) {
  if (!errors.isEmpty()) {
    return {
      status: 401,
      message: "Email invalid",
    };
  }
  try {
    const user = await User.findOne({
      email: userInput.email,
    });
    if (!user) {
      return {
        status: 401,
        message: "User not found",
      };
    }
    // Verify codes sent by users
    const verifyCode = await bcrypt.compare(
      userInput.code.toString(),
      user.verificationCode
    );
    if (!verifyCode) {
      return {
        status: 403,
        message: "Invalid code",
      };
    }
    return {
      status: 200,
      message: "Success verification code",
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function resetPasswordService(errors, userInput) {
  if (!errors.isEmpty()) {
    return {
      status: 401,
      message: "Email invalid",
    };
  }
  try {
    const hashedPassword = await bcrypt.hash(userInput.newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email: userInput.email },
      {
        password: hashedPassword,
        updated_at: new Date(),
        verificationCode: null,
      },
      { new: true }
    );
    if (!user) {
      return {
        status: 401,
        message: "User not found",
      };
    }
    await user.save();
    return {
      status: 200,
      message:
        "The password has been successfully reset. Please log in with your new password.",
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  authLoginService,
  authSignupService,
  forgotPasswordService,
  verifyCodeService,
  resetPasswordService,
};
