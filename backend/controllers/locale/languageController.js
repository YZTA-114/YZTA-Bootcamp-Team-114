const ErrorResponse = require("../../utils/errorResponse");
const Language = require("../../models/locale/Language");
const asyncHandler = require("../../middleware/async");

// @desc Get all languages
// @route GET /api/v1/languages
// @access Public
exports.getLanguages = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single language
// @route GET /api/v1/languages/:id
// @access Public
exports.getLanguage = asyncHandler(async (req, res, next) => {
  const language = await Language.findById(req.params.id);

  if (!language) {
    return next(
      new ErrorResponse(`Language not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: language,
  });
});

// @desc Create new language
// @route POST /api/v1/languages
// @access Private/Admin
exports.createLanguage = asyncHandler(async (req, res, next) => {
  const language = await Language.create(req.body);

  res.status(201).json({
    success: true,
    data: language,
  });
});

// @desc Update language
// @route PUT /api/v1/languages/:id
// @access Private/Admin
exports.updateLanguage = asyncHandler(async (req, res, next) => {
  let language = await Language.findById(req.params.id);

  if (!language) {
    return next(
      new ErrorResponse(`Language not found with id of ${req.params.id}`, 404)
    );
  }

  language = await Language.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: language,
  });
});

// @desc Delete language
// @route DELETE /api/v1/languages/:id
// @access Private/Admin
exports.deleteLanguage = asyncHandler(async (req, res, next) => {
  const language = await Language.findById(req.params.id);

  if (!language) {
    return next(
      new ErrorResponse(`Language not found with id of ${req.params.id}`, 404)
    );
  }

  await language.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
