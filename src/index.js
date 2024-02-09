const express = require("express");
const app = express();  
const bodyParser = require("body-parser");
const { connectDB } = require("./db/db");

//.env
require("dotenv").config();
const port = process.env.PORT;

//middleware
app.use(express.json());

//koneksi database
connectDB();

app.get("/", (req, res) => {
  res.redirect("/login");
});

const controllerUser = require('./user/user.controller')
app.use("/user", controllerUser)

const controllerAuth = require("./auth/auth.controller");
app.use("/auth", controllerAuth);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
