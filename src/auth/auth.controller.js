const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { authSignupService, authLoginService } = require("./auth.service");

const emailValidation = body(
  "email",
  "email yang anda masukkan tidak valid"
).isEmail();

router.post("/login", emailValidation, async (req, res) => {
  try {
    const inputValidation = validationResult(req);
    const userInput = req.body;
    const authLogin = await authLoginService(inputValidation, userInput);
    res.send({ authLogin });
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/signup", emailValidation, async (req, res) => {
  try {
    const inputValidation = validationResult(req);
    const userInput = req.body;
    const authSignup = await authSignupService(inputValidation, userInput);
    res.send({authSignup});
  } catch (error) {
    res.status(201).send(error.message);
  }
});

module.exports = router;
