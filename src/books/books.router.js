const express = require("express");
const router = express.Router();
const path = require("path");
const { imgUploadConfig, MulterError } = require("../config/multer.config");
const streamImgUploadToCloud = require("../utils/streamUploadImgToCloud");
const uploadTest = imgUploadConfig.single("test");
router.post("/test", async (req, res) => {
  uploadTest(req, res, async function (error) {
    try {
      if (error instanceof MulterError) {
        throw new Error(`errMulter: ${error.message}`);
      }
      const file = req.file;
      const data = req.body;
      if (!file && data) throw new Error("Data dan file dibutuhkan");
      const { name, description, price } = data;
      const { secure_url } = await streamImgUploadToCloud(file.buffer);
      res.json({
        success: true,
        msg: "Success uploading image",
        url: secure_url,
      });
    } catch (error) {
      res.json({ msg: error.message });
    }
  });
});
router.get("/image/:filename", (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, "uploads/" + filename);
  console.log(path);
  console.log({ fullfilepath });
  console.log({ dirname });
  console.log({ filename });
  return res.sendFile(fullfilepath);
});

module.exports = router;
