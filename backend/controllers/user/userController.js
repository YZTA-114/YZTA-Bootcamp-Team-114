const ErrorResponse = require('../../utils/errorResponse');
const User = require('../../models/user/User');

const asyncHandler = require('../../middleware/async');

// @desc Get all users
// @route GET /api/v1/users
// @access Private, only admin
exports.getUsers = asyncHandler(async (req, res, next) => {
        // This is for getting all of the users
        res.status(200).json(res.advancedResults);
});

// @desc Get single user
// @route GET /api/v1/users/:id
// @access Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate({
        path: 'userProfile',
    })

    if(!user) {
        return next(
            new ErrorResponse(`No user with the id of ${req.params.id}`, 
            404
        ));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc Update user
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`No user with the id of ${req.params.id}`, 
            404
        ));
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc Delete user
// @route DELETE /api/v1/users/:id
// @access Private - Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    let userToDelete = await User.findById(req.params.id);

    if(!userToDelete) {
        return next(
            new ErrorResponse(`No user with the id of ${req.params.id}`, 
            404
        ));
    }

    await userToDelete.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});