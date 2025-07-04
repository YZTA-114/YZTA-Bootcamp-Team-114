const crypto = require("crypto");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../models/user/User");
const UserProfile = require("../../models/user/UserProfile");
const Country = require("../../models/locale/Country");
const Language = require("../../models/locale/Language");

const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../../utils/cloudinary");
const asyncHandler = require("../../middleware/async");
const { transaction } = require("../../middleware/transaction");
const sendEmail = require("../../utils/sendEmail");

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = transaction(async (req, res, session, next) => {
  console.log(req.body);
  // Create user
  let user = await User.create([req.body.user], { session }); //req.body.user, req.body.socialMedias, req.body.addresses etc.

  // Export from array
  user = user[0];

  // Get Country and Language
  const country = await Country.findOne({
    isoCode: req.body.locale.country,
  })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (!country) {
    return next(new ErrorResponse("Country not found", 404));
  }

  const language = await Language.findOne({
    isoCode: req.body.locale.language,
  })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (!language) {
    return next(new ErrorResponse("Language not found", 404));
  }

  // Create user profile
  req.body.userProfile.user = user._id;
  await UserProfile.create(
    [{ ...req.body.userProfile, country: country._id, language: language._id }],
    { session }
  );

  sendTokenResponse(user, 200, res);
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Email veya şifre hatalı!", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Email veya şifre hatalı!", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc     Get current logged in user
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  //const user = await User.findById(req.user.id).populate('account');

  const user = await req.user.populate("userProfile");

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc     Upload avatar photo for user
// @route    PUT /api/v1/auth/uploadavatar
// @access   Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  const file = req.files?.file;
  console.log(file);

  const userProfile = await UserProfile.findOne({ user: req.user.id });

  if (!userProfile) {
    return next(
      new ErrorResponse(
        `There is no profile of user with the id of ${req.user.id}`,
        404
      )
    );
  }

  if (file) {
    // Upload new image to cloudinary
    let imageUrl = await uploadToCloudinary(file, "avatar-images", {
      public_id: file.name,
    });

    // Remove old avatar image
    if (userProfile && userProfile.avatar != process.env.DEFAULT_AVATAR) {
      const oldFileName = userProfile.avatar.split("/").pop().split(".")[0];
      const publicId = `avatar-images/${oldFileName}`;
      await removeFromCloudinary(publicId);
    }

    // Update with the new one
    userProfile.avatar = imageUrl;
    await userProfile.save();
  }

  res.status(200).json({
    success: true,
    data: file.name,
  });
});

// @desc     Delete avatar photo for user
// @route    PUT /api/v1/auth/deleteavatar
// @access   Private
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
  const userProfile = await UserProfile.findOne({ user: req.user.id });

  if (!userProfile) {
    return next(
      new ErrorResponse(
        `There is no profile of user with the id of ${req.user.id}`,
        404
      )
    );
  }

  if (userProfile.avatar === process.env.DEFAULT_AVATAR) {
    return next(
      new ErrorResponse(`You are already using the default avatar`, 500)
    );
  }

  // Delete previous profile photo
  if (userProfile && userProfile.avatar) {
    const oldFileName = userProfile.avatar.split("/").pop().split(".")[0];
    const publicId = `avatar-images/${oldFileName}`;
    await removeFromCloudinary(publicId);
  }

  // Set image to no-avatar.jpg
  userProfile.avatar = process.env.DEFAULT_AVATAR;
  await userProfile.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email.", 404));
  }

  if (!user.isVerified) {
    return next(new ErrorResponse("You need to verify your email.", 403));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  /* const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has
    requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`; */

  const resetUrl = `${req.protocol}://localhost:8080/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. You can reset your password <a href="${resetUrl}">here</a>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset Password
// @route   GET /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  // Get the user by the token which is not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined; // it just goes away
  user.resetPasswordToken = undefined; // it just goes away
  await user.save();

  //We are going to send back a token, so it will be logged in
  sendTokenResponse(user, 200, res);
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // TODO: You may move this update to userProfileController
  const allowedFields = ["firstName", "lastName", "language", "country"];
  const fieldsToUpdate = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  console.log(fieldsToUpdate);

  // If there is a change of userProfile, update UserProfile
  if (Object.keys(fieldsToUpdate).length > 0) {
    await UserProfile.findOneAndUpdate({ user: req.user.id }, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  }

  // Get populated User
  const user = await User.findById(req.user.id).populate("userProfile");

  // If there is a change of email, set email and set isVerified false
  // After change of email, user should verify email again
  if (req.body.email && user.email !== req.body.email) {
    user.email = req.body.email;
    user.isVerified = false;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token fro model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    //sameSite: 'None',
  };

  // enable secure flag if it is in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
