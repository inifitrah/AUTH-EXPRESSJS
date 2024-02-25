const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  authSignupService,
  authLoginService,
  forgotPasswordService,
  verifyCodeService,
  resetPasswordService,
} = require("./auth.service");

router.post("/login", [body("email").trim().isEmail()], async (req, res) => {
  try {
    const errors = validationResult(req);
    const userInput = req.body;
    const { status, message, token, data } = await authLoginService(
      errors,
      userInput
    );
    res.status(status).send({
      message,
      token,
      data,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
});

router.post("/signup", [body("email").trim().isEmail()], async (req, res) => {
  try {
    const errors = validationResult(req);
    const userInput = req.body;
    const { status, message, token, data } = await authSignupService(
      errors,
      userInput
    );
    res.status(status).send({
      message,
      token,
      data,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
});

router.put(
  "/forgot-password",
  [body("email").trim().isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    const userInput = req.body;
    try {
      const { status, message } = await forgotPasswordService(
        errors,
        userInput
      );
      res.status(status).send({ message });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.put(
  "/verify-code",
  [body("email").trim().isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    const userInput = req.body;
    try {
      const { status, message } = await verifyCodeService(errors, userInput);
      res.status(status).send({ message });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.put(
  "/reset-password",
  [body("email").trim().isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    const userInput = req.body;
    try {
      const { status, message } = await resetPasswordService(errors, userInput);
      res.status(status).send({ message });
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = router;
