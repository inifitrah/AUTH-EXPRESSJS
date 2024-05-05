const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mail = require("../utils/mail");
const Otp = require("../models/otp.model");

async function refreshTokenService(cookies) {
  try {
    const { refreshToken } = cookies;
    if (!refreshToken) throw new Error("Refresh token is required");
    const {
      user: { email },
    } = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const userDB = await User.findOne({ email });
    if (refreshToken !== userDB.refresh_token)
      throw new Error("Invalid refresh token");
    const user = {
      userId: userDB._id,
      email: userDB.email,
      profileUrl: userDB.profile_url,
    };
    const accessToken = jwt.sign(
      { user },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
      }
    );
    return { accessToken };
  } catch (error) {
    throw new Error(error);
  }
}

async function loginService({ email, password }) {
  try {
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      throw new Error("User not found, please register!");
    }
    const checkPassword = await bcrypt.compare(password, isUserExist.password);
    if (!checkPassword) {
      throw new Error("Wrong password!");
    }
    const user = {
      userId: isUserExist._id,
      email: isUserExist.email,
    };
    const accessToken = jwt.sign(
      { user },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
      }
    );
    const refreshToken = jwt.sign(
      { user },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
      }
    );
    //add refresh token to db
    await User.updateOne(
      { email: isUserExist.email },
      { refresh_token: refreshToken },
      { new: true }
    );
    return {
      status: 200,
      refreshToken,
      accessToken,
      msg: "Logged is successful!",
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function signupService({ email, password, token }) {
  try {
    if (!token) throw new Error("Token required");
    const {
      user: { email: emailToken },
    } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (email !== emailToken) throw new Error("Wrong token");
    const isUserExist = await User.findOne({ email });
    if (isUserExist) throw new Error("User allready! Please login.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return {
      status: 200,
      msg: `Register successfull.`,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function resetPasswordService({ email, newPassword, token }) {
  try {
    if (!token) throw new Error("Token required");
    const {
      user: { email: emailToken },
    } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (email !== emailToken) throw new Error("Wrong token");
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new Error("User not found!");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { new: true }
    );
    return {
      status: 200,
      msg: "The password has been successfully reset. Please log in with your new password.",
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function generateOtpAndSendEmailService({ email }) {
  try {
    const existingOtp = await Otp.findOne({ user_email: email });
    const currentTime = new Date();

    if (existingOtp) {
      const timeDiff = (currentTime - existingOtp.createdAt) / 1000;
      if (timeDiff < 60) {
        throw new Error(
          `Harap tunggu selama ${Math.round(
            60 - timeDiff
          )} detik untuk meminta OTP baru`
        );
      }
      await Otp.deleteOne({ user_email: email });
    }
    // Generate OTP baru
    const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
    console.log({ email });
    console.log({ otp });
    const hashedOtp = await bcrypt.hash(otp, 10);
    // Simpan OTP baru
    const newOtp = new Otp({
      user_email: email,
      otp: hashedOtp,
    });
    await newOtp.save();

    // Kirim OTP via email
    await mail(email, `Kode verifikasi anda ${otp}`);
    return {
      status: 200,
      msg: "Verification Code has been sent to your Email. Please check it out!",
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function verifyOtpService({ otp, email }) {
  try {
    const existingOtp = await Otp.findOne({ user_email: email });
    if (!existingOtp) throw new Error("Otp expire");
    const verifyOtp = await bcrypt.compare(otp.toString(), existingOtp.otp);
    if (!verifyOtp) throw new Error("Wrong otp!");

    //generate token
    const user = {
      email,
    };
    const accessToken = jwt.sign(
      { user },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );
    // send token
    return {
      msg: "Verify otp success",
      status: 200,
      accessToken,
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  loginService,
  verifyOtpService,
  signupService,
  resetPasswordService,
  generateOtpAndSendEmailService,
  refreshTokenService,
};
