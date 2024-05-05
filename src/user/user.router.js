const express = require("express");
const router = express.Router();
const path = require("path");
const { imgUploadConfig, MulterError } = require("../config/multer.config");
const streamImgUploadToCloud = require("../utils/streamUploadImgToCloud");
const User = require("../models/user.model");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadProfile = imgUploadConfig.single("profile");

router.post("/profile", async (req, res) => {
  uploadProfile(req, res, async function (error) {
    try {
      if (error instanceof MulterError) {
        throw new Error(`errMulter: ${error.message}`);
      }
      const file = req.file;
      const body = req.body;
      if (!file && data) throw new Error("Data and file required");
      const { secure_url } = await streamImgUploadToCloud(file.buffer);
      console.log(secure_url);
      // aad secure url to db
      const updateUser = await User.updateOne(
        { email: body.email },
        {
          profile_url: secure_url,
        },
        { new: true }
      );
      if (!updateUser) throw new Error("User not found");

      res.json({
        success: true,
        msg: "Add profile is success.",
      });
    } catch (error) {
      res.json({ msg: error.message });
    }
  });
});

module.exports = router;
