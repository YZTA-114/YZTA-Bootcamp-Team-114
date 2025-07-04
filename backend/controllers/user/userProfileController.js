const ErrorResponse = require('../../utils/errorResponse');
const UserProfile = require('../../models/user/UserProfile');
const User = require('../../models/user/User');

const asyncHandler = require('../../middleware/async');

// @desc Get all user profiles / Get user profile of specific user
// @route GET /api/v1/userprofiles  -  Private, only admin
// @roue GET /api/v1/users/:userId/userprofiles  - Private
// @access Private, only admin
exports.getUserProfiles = asyncHandler(async (req, res, next) => {
    if(req.params.userId) { // GET user profile of specific user
        const userProfile = await UserProfile.findOne({ user: req.params.userId});

        if(!userProfile) {
            return next(
                new ErrorResponse(`User profile not found`, 
                404
            ));
        }

        // Make sure user has permission for this operation
        if (
            req.user._id.toString() !== userProfile.user?.toString() &&
            req.user.role !== "admin"
          ) {
            return next(
              new ErrorResponse(
                `User does not have permission for this operation`,
                401
              )
            );
          }

          res.status(200).json({
            success: true,
            data: userProfile
        });

    }else {
        if(req.user.role !== "admin") {
            return next(
              new ErrorResponse(
                `User does not have permission for this operation`,
                401
              )
            );
          }
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get single user profile
// @route GET /api/v1/userprofiles/:id
// @access Private
exports.getUserProfileById = asyncHandler(async (req, res, next) => {
    const userProfile = await UserProfile.findById(req.params.id);

    if(!userProfile) {
        return next(
            new ErrorResponse(`No User Profile with the id of ${req.params.id}`, 
            404
        ));
    }

    // Make sure user has permissions
    if (
        req.user._id.toString() !== userProfile.user?.toString() &&
        req.user.role !== "admin"
      ) {
        return next(
          new ErrorResponse(
            `User does not have permission for this operation`,
            401
          )
        );
      }

    res.status(200).json({
        success: true,
        data: userProfile
    });
});

// @desc    Add User Profile
// @route   POST /api/v1/users/:userId/userprofiles
// @access  Private, only admin
exports.addUserProfile = asyncHandler(async (req, res, next) => {
    req.body.user = req.params.userId;
    
    const user = await User.findById(req.params.userId);

    if(!user) {
        return next(
          new ErrorResponse(
            `No User with the id of ${req.params.userId}`
          ),
          404
        );
    }

    const userProfile = await UserProfile.create(req.body);

    res.status(200).json({
        success: true,
        data: userProfile
    })
});

// @desc Update User Profile
// @route PUT /api/v1/userprofiles/:id
// @access Private - User logged in, Admin
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    let userProfile = await UserProfile.findById(req.params.id);

    if(!userProfile) {
        return next(
            new ErrorResponse(`No User Profile with the id of ${req.params.id}`, 
            404
        ));
    }

    // Make sure user has permissions for this operation
    if (
        req.user._id.toString() !== userProfile.user?.toString() &&
        req.user.role !== "admin"
      ) {
        return next(
          new ErrorResponse(
            `User does not have permission for this operation`,
            401
          )
        );
      }

    userProfile = await UserProfile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: userProfile
    });
});

// @desc Delete User Profile
// @route DELETE /api/v1/userprofiles/:id
// @access Private - Admin
exports.deleteUserProfile = asyncHandler(async (req, res, next) => {
    let userProfileToDelete = await UserProfile.findById(req.params.id);

    if(!userProfileToDelete) {
        return next(
            new ErrorResponse(`No User Profile with the id of ${req.params.id}`, 
            404
        ));
    }

    await userProfileToDelete.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});