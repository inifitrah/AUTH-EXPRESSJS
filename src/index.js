const express = require("express");
const app = express();  
const { connectDB } = require("./db/db");

//.env
require("dotenv").config();
const port = process.env.PORT;

//middleware
app.use(express.json());

//koneksi database
connectDB();

const controllerUser = require('./user/user.controller')
app.use("/", controllerUser)

const controllerAuth = require("./auth/auth.controller");
app.use("/auth", controllerAuth);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
