const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file, folder, options) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { folder: folder, ...options };
    const uploadFile = file.data
      ? `data:image/jpeg;base64,${file.data.toString("base64")}` // Handle base64 data
      : file.tempFilePath; // Handle local temp file path

    cloudinary.uploader.upload(uploadFile, uploadOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};

const removeFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
