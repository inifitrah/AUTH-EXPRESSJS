const bcrypt = require("bcrypt");

async function compareExpAndHashPassword(expPass, hashPass){
  return await bcrypt.compare(expPass, hashPass).then((result) => result);
};

async function hashedPassword(pass){
      return await bcrypt
        .hash(pass, 7)
        .then((hash) => hash)
        .catch((err) => err.message("hash failed"));
    };

module.exports = {
  compareExpAndHashPassword, hashedPassword
}
