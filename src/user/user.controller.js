const express = require("express");
const User = require("../models/user.model");
const { body, validationResult, query } = require("express-validator");
const router = express.Router();

//ambil semua user
router.get("/", async (req, res) => {
  res.send(await User.find({}));
});

//cek user by email
router.post(
  "/",
  body("email", "email tidak valid").isEmail(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      console.log("bisa");
      const email = req.body.email;
      const getUserByEmail = await User.findOne({ email });
      getUserByEmail
        ? res.send(getUserByEmail)
        : res.send("user tidak ditemukan");
    }
  }
);

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const getUserById = await User.findOne({ _id: userId })

 res.send(await getUserById)
});

//hapus user
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await User.findOneAndDelete({ _id: id }).then(() => {
    res.send(`user dengan id ${id} berhasil dihapus`);
  });
});

module.exports = router;
