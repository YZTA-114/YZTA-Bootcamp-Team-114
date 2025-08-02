const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const ErrorResponse = require("../utils/errorResponse");

// Configure multer storage
const storage = multer.memoryStorage();

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_UPLOAD || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return cb(new ErrorResponse("Please upload an image file", 400), false);
    }
    cb(null, true);
  }
});

// Middleware to process the uploaded file
const processUpload = (fileKey) => (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  // Create custom filename
  const date = new Date();
  const newFilename = uuidv4() +
    "_" +
    date.getMonth() +
    "_" +
    date.getDay() +
    "_" +
    date.getFullYear();

  req.file.filename = newFilename;
  next();
};

// Export middleware that combines multer upload and processing
const photoUpload = (fileKey) => [
  upload.single(fileKey),
  processUpload(fileKey)
];

module.exports = photoUpload;
