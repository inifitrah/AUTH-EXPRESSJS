const {
  loginService,
  refreshTokenService,
  signupService,
  generateOtpAndSendEmailService,
  resetPasswordService,
  verifyOtpService,
} = require("./auth.service");
const User = require("../models/user.model");

//refresh token
exports.refreshToken = async (req, res) => {
  try {
    const cookies = req?.cookies;
    const refreshToken = await refreshTokenService(cookies);
    const { accessToken } = refreshToken;
    return res.status(200).json({
      is_success: true,
      token: accessToken,
    });
  } catch (error) {
    res.status(400).json({ is_success: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const userInput = req.body;
    const login = await loginService(userInput);
    const { refreshToken, accessToken, status, msg } = login;
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7d
      })
      .json({
        is_login: true,
        msg,
        token: accessToken,
      })
      .status(status);
  } catch (error) {
    res.status(400).json({
      is_login: false,
      msg: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      {
        refresh_token: null,
      },
      {
        new: true,
      }
    );
    if (!user) throw new Error("User not found");
    res.clearCookie("refreshToken", { httpOnly: true });
    res.json({ msg: "Success logout" });
    return;
  } catch (error) {
    res.json(error.message);
  }
};

exports.signup = async (req, res) => {
  try {
    const userInput = req.body;
    const signup = await signupService(userInput);
    const { status, msg } = signup;
    res
      .json({
        status,
        msg,
      })
      .status(status);
  } catch (error) {
    res.status(401).json({
      msg: error.message,
    });
  }
};

exports.otp = async (req, res) => {
  try {
    const userInput = req.body;
    const { status, msg } = await generateOtpAndSendEmailService(userInput);
    res.status(status).json({
      status,
      msg,
    });
  } catch (error) {
    res.status(401).json({
      msg: error.message,
    });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const userInput = req.body;
    const { status, msg, accessToken } = await verifyOtpService(userInput);
    res.status(status).json({
      status,
      msg,
      token: accessToken,
    });
  } catch (error) {
    res.status(401).json({
      msg: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const userInput = req.body;
  try {
    const { status, msg } = await resetPasswordService(userInput);
    res.status(status).send({ msg });
  } catch (error) {
    res.json({ msg: error.message });
  }
};
