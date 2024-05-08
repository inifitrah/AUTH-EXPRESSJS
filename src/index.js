const express = require("express");
const app = express();
const { connectDB } = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Otp = require("./models/otp.model");
const User = require("./models/user.model");

//.env
require("dotenv").config();
const port = process.env.PORT;

//cors
app.use(cors({ origin: process.env.URL_CORS_ORIGIN, credentials: true }));

//middleware
app.use(express.json());

app.use(cookieParser());

//koneksi database
connectDB();

app.get("/api", (_, r) => {
  r.json({
    status: "OK",
    version: "1.0.0",
    env: parseInt(process.env.COOKIE_EXP),
  });
});
const authMiddleware = require("./middlewares/auth.middleware");
app.get("/users", authMiddleware, async (_, r) => {
  r.json({
    users: await User.find({}),
    otps: await Otp.find({}),
  });
});

const UserRoutes = require("./user/user.router");
app.use("/", UserRoutes);

const BooksRoutes = require("./books/books.router");
app.use("/book", BooksRoutes);

const AuthRoutes = require("./auth/auth.router");
app.use("/auth", AuthRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
