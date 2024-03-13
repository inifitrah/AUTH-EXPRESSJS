const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mail = require("../utils/mail");

async function authLoginService(errors, userInput) {
  if (!errors.isEmpty()) throw "Invalid Email";
  try {
    // if true return the response
    return await User.findOne({ email: userInput.email })
      //cek email
      .then(async (user) => {
        if (!user) {
          throw "User not found";
        }
        if (!user.verified) {
          throw "Please verify your account";
        }
        // cek password
        await bcrypt
          .compare(userInput?.password, user?.password)
          .then((result) => {
            if (!result) {
              throw Error("Password incorrect");
            }
          })
          .catch((error) => {
            throw Error(error);
            0;
          });
        //generate token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES,
          }
        );
        return { status: 200, token, message: "Authenticated successfully" };
      })
      .catch((error) => {
        throw Error(error);
      });
  } catch (error) {
    throw new Error(error);
  }
}

async function authSignupService(errors, userInput) {
  if (!errors.isEmpty()) throw "Invalid Email";
  try {
    return await User.findOne({ email: userInput.email }).then(async (user) => {
      if (user && user.verified) {
        throw "User allready! Please login.";
      } else if (user && !user.verified) {
        await generateCodeAndSendEmailService(user.email);
      }

      if (!user) {
        await bcrypt.hash(userInput.password, 10).then(async (hash) => {
          new User({
            email: userInput.email,
            password: hash,
            verified: false,
          })
            .save()
            .then(async (user) => {
              return await generateCodeAndSendEmailService(user.email);
            });
        });
        return {
          status: 200,
          message: `You must verify your email, Check your email for a verification code. `,
        };
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function verifyAccountService(errors, userInput) {
  if (!errors.isEmpty()) throw "Invalid Email";
  try {
    const verifyCode = await verifyCodeService(userInput.email, userInput.code); //true or false
    if (!verifyCode) throw "Wrong code";
    const user = await User.findOneAndUpdate(
      { email: userInput.email },
      { verified: true, verificationCode: null },
      { new: true }
    );
    user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );
    return {
      id: user._id,
      email: user.email,
      status: 200,
      message: "Account Verified",
      token,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function verifyCodeService(email, verificationCode) {
  try {
    //return true or false
    return await User.findOne({
      email,
    }).then(async (user) => {
      if (user === null) throw "User not found";
      return await bcrypt
        .compare(verificationCode.toString(), user.verificationCode)
        .then((result) => {
          if (!result) throw "Invalid Code";
          return result;
        });
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function forgotPasswordService(errors, userInput) {
  if (!errors.isEmpty()) throw "Invalid Email";
  try {
    return await generateCodeAndSendEmailService(userInput.email);
  } catch (error) {
    throw new Error(error);
  }
}

async function resetPasswordService(errors, userInput) {
  if (!errors.isEmpty()) throw "Invalid Email";
  try {
    return await bcrypt.hash(userInput.newPassword, 10).then(async (hash) => {
      await User.findOneAndUpdate(
        { email: userInput.email },
        {
          password: hash,
          updatedAt: new Date(),
          verificationCode: null,
        },
        { new: true }
      ).then((user) => {
        if (!user) throw "User not found!.";
        user.save();
      });
      return {
        status: 200,
        message:
          "The password has been successfully reset. Please log in with your new password.",
      };
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function generateCodeAndSendEmailService(email) {
  try {
    //generate verification code
    const verificationCode = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();
    //hash verificationCode
    return await bcrypt.hash(verificationCode, 5).then(async (hash) => {
      //update data
      await User.findOneAndUpdate(
        { email },
        { verificationCode: hash },
        { new: true }
      ).then(async (user) => {
        if (!user) throw Error("User not found");
        return user.save().then(async (user) => {
          await mail(user.email, verificationCode);
        });
      });

      return {
        status: 200,
        message:
          "Verification Code has been sent to your Email. Please check it out!",
      };
    });
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
  verifyAccountService,
};
