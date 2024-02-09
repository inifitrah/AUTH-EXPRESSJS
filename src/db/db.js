const { default: mongoose } = require("mongoose");

async function connectDB(){
 const dbUrl = process.env.DATABASE_URL
 await mongoose
   .connect(dbUrl)
   .then(() => {
     console.log("connected to mongodb");
   })
   .catch((err) => console.log("gagal connect"));
}

  module.exports = {connectDB, mongoose}
