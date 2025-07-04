const ErrorResponse = require("../../utils/errorResponse");
const CountryTranslation = require("../../models/locale/CountryTranslation");
const Country = require("../../models/locale/Country");
const Language = require("../../models/locale/Language");
const asyncHandler = require("../../middleware/async");

// @desc Get all country translations
// @route GET /api/v1/countryTranslations
// @route GET /api/v1/languages/:languageId/countryTranslations
// @access Public
exports.getCountryTranslations = asyncHandler(async (req, res, next) => {
  if (req.params.languageId) {
    const countryTranslations = await CountryTranslation.find({
      language: req.params.languageId,
    }).populate(["language", "country"]);
    return res.status(200).json({
      success: true,
      data: countryTranslations,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single country translation
// @route GET /api/v1/countryTranslations/:id
// @access Public
exports.getCountryTranslation = asyncHandler(async (req, res, next) => {
  const countryTranslation = await CountryTranslation.findById(
    req.params.id
  ).populate(["language", "country"]);

  if (!countryTranslation) {
    return next(
      new ErrorResponse(
        `Country translation not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: countryTranslation,
  });
});

// @desc Create new country translation
// @route POST /api/v1/countryTranslations
// @access Private/Admin
exports.createCountryTranslation = asyncHandler(async (req, res, next) => {
  // Check if country and language exists
  if (!req.body.country || !req.body.language) {
    return next(new ErrorResponse(`Country and language are required`, 400));
  }

  const country = await Country.findById(req.body.country);

  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${req.body.country}`, 404)
    );
  }

  const language = await Language.findById(req.body.language);

  if (!language) {
    return next(
      new ErrorResponse(
        `Language not found with id of ${req.body.language}`,
        404
      )
    );
  }

  const countryTranslation = await CountryTranslation.create(req.body);

  res.status(201).json({
    success: true,
    data: countryTranslation,
  });
});

// @desc Update country translation
// @route PUT /api/v1/countryTranslations/:id
// @access Private/Admin
exports.updateCountryTranslation = asyncHandler(async (req, res, next) => {
  let countryTranslation = await CountryTranslation.findById(req.params.id);

  if (!countryTranslation) {
    return next(
      new ErrorResponse(
        `Country translation not found with id of ${req.params.id}`,
        404
      )
    );
  }

  countryTranslation = await CountryTranslation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: countryTranslation,
  });
});

// @desc Delete country translation
// @route DELETE /api/v1/countryTranslations/:id
// @access Private/Admin
exports.deleteCountryTranslation = asyncHandler(async (req, res, next) => {
  const countryTranslation = await CountryTranslation.findById(req.params.id);

  if (!countryTranslation) {
    return next(
      new ErrorResponse(
        `Country translation not found with id of ${req.params.id}`,
        404
      )
    );
  }

  await countryTranslation.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
