const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const photoUpload = (fileKey, required = true) =>
  asyncHandler(async (req, res, next) => {
    const file = req.files && req.files[fileKey];

    if (!file && required) {
      return next(new ErrorResponse("Please upload a file", 400));
    } else if (!file) {
      return next();
    }

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Create custom filename
    const date = new Date();
    file.name =
      uuidv4() +
      "_" +
      date.getMonth() +
      "_" +
      date.getDay() +
      "_" +
      date.getFullYear();
      // + path.parse(file.name).ext;

    req.files[fileKey] = file;

    next();
  });

module.exports = photoUpload;
