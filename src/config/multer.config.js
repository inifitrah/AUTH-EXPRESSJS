const multer = require("multer");
const { memoryStorage, MulterError } = multer;
const imgUploadConfig = multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    const validExtension = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtension.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Tipe file tidak valid"), false);
  },
  limits: {
    fileSize: 3 * 1024 * 1024, //3mb
  },
});
module.exports = {
  imgUploadConfig,
  MulterError,
};
