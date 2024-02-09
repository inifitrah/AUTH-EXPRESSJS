const User = require("../models/user.model");
const {
  compareExpAndHashPassword,
  hashedPassword,
} = require('./utils/passHashCompare.utils')


async function authLoginService(inputValidation, userInput) {
  const errors = inputValidation;
  if (!errors.isEmpty()) {
    return errors.array();
  }
  const { email, password } = userInput;
  if (email && password) {
    //cek email
    const getUserByEmail = await User.findOne({ email });
    if (!getUserByEmail) {
      throw Error("email tidak ada di database");
    }

    //cek password
    const cekPass = await compareExpAndHashPassword(
      password,
      getUserByEmail.password
    );
    if (!cekPass) {
      throw Error("email atau pasword anda salah");
    }

    return {
      msg: 'login successfully'
    }
  }
}

async function authSignupService(inputValidation, userInput) {
  const errors = inputValidation
   if (!errors.isEmpty()) {
    return errors.array();
  }
  const { email, password } = userInput
  if (email) {
    const getUserByEmail = await User.findOne({ email });
    
     if (getUserByEmail) {
       throw Error("email telah terdaftar");
    }

    if (!password) {
      throw Error("password is null");
    }
      const hashPassResult = await hashedPassword(password);
      const newUser = new User({
        email,
        password: hashPassResult,
        created_at: new Date(),
        updated_at: new Date(),
      });
      newUser.save().catch((err)=>err.message('gagal simpan data'))
    return newUser
  }
}

module.exports = {
  authLoginService,
  authSignupService
}