const nodemailer = require("nodemailer");

async function mail(email, message) {
  const port = 587;
  const host = process.env.HOST;
  const YOUR_LOGIN = process.env.YOUR_LOGIN;
  const YOUR_KEY = process.env.YOUR_KEY;

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user: YOUR_LOGIN,
      pass: YOUR_KEY,
    },
  });

  try {
    return await transporter.sendMail({
      from: {
        name: "TRAH TECH",
        address: "trah@gmail.com",
      },
      to: {
        name: email,
        address: email,
      },
      subject: "Verifikasi email",
      text: message,
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = mail;
