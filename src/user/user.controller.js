const express = require("express");
const jwt = require("jsonwebtoken");
const { deleteAccountService } = require("./user.service");
const User = require("../models/user.model");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req?.headers["authorization"];
    if (!authHeader) {
      return res.send("Token required");
    }
    const token = authHeader.split(" ")[1];
    req.userLogin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    console.error(error.message);
  }
};

//delete user/account
router.delete("/", verifyToken, async (req, res) => {
  try {
    const userLogin = req.userLogin;
    const userInput = req.body;
    const { status, message } = await deleteAccountService(
      userLogin,
      userInput
    );
    res.status(status).send({
      message,
    });
  } catch (error) {
    console.error(error.message);
  }
});

//if you want to deleted all user
router.delete("/all", async (req, res) => {
  await User.deleteMany();
  res.send("All users deletedsuccessfully!");
});

module.exports = router;
