const streamifier = require("streamifier");
const cloudinaryV2 = require("../config/cloudinary.config");
function streamImgUploadToCloud(buffer) {
  return new Promise((resolve, reject) => {
    const uniqueSuffix =
      "IMG" + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    const stream = cloudinaryV2.uploader.upload_stream(
      {
        filename: uniqueSuffix,
        public_id: uniqueSuffix,
        folder: "books",
        resource_type: "image",
      },
      (error, result) => {
        if (result) {
          const validFormat = ["jpg", "jpeg", "png"];
          const { format, resource_type } = result;
          if (validFormat.includes(format) && resource_type === "image") {
            resolve(result);
          } else {
            reject(new Error("Format file tidak valid"));
          }
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = streamImgUploadToCloud;
