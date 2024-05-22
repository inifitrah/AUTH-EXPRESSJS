const express = require("express");
const app = express();
const { connectDB } = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//.env
require("dotenv").config();
const port = process.env.PORT;

//cors
app.use(cors({ origin: process.env.URL_CORS_ORIGIN, credentials: true }));

//middleware
app.use(express.json());

app.use(cookieParser());

//connec database
connectDB();

app.get("/api", (_, r) => {
  r.json({
    status: "OK",
    version: "1.0.0",
  });
});

const AuthRoutes = require("./auth/auth.router");
app.use("/auth", AuthRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
