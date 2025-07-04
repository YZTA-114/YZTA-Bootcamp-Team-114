const ErrorResponse = require("../../utils/errorResponse");
const Country = require("../../models/locale/Country");
const asyncHandler = require("../../middleware/async");

// @desc Get all countries
// @route GET /api/v1/countries
// @access Public
exports.getCountries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single country
// @route GET /api/v1/countries/:id
// @access Public
exports.getCountry = asyncHandler(async (req, res, next) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: country,
  });
});

// @desc Create new country
// @route POST /api/v1/countries
// @access Private/Admin
exports.createCountry = asyncHandler(async (req, res, next) => {
  const country = await Country.create(req.body);

  res.status(201).json({
    success: true,
    data: country,
  });
});

// @desc Update country
// @route PUT /api/v1/countries/:id
// @access Private/Admin
exports.updateCountry = asyncHandler(async (req, res, next) => {
  let country = await Country.findById(req.params.id);

  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${req.params.id}`, 404)
    );
  }

  country = await Country.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: country,
  });
});

// @desc Delete country
// @route DELETE /api/v1/countries/:id
// @access Private/Admin
exports.deleteCountry = asyncHandler(async (req, res, next) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return next(
      new ErrorResponse(`Country not found with id of ${req.params.id}`, 404)
    );
  }

  await country.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
