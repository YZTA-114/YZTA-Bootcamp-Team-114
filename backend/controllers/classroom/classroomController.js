const ErrorResponse = require('../../utils/errorResponse');
const Classroom = require('../../models/classroom/Classroom');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');

const asyncHandler = require('../../middleware/async');

// @desc Get all classrooms
// @route GET /api/v1/classrooms
// @route GET /api/v1/users/:userId/classrooms
// @access Private
exports.getClassrooms = asyncHandler(async (req, res, next) => {
    if (req.params.userId) {
        const classrooms = await Classroom.find({ owner: req.params.userId });
        if (!classrooms) {
            return next(
                new ErrorResponse(`No classrooms found for user ${req.params.userId}`, 404)
            );
        }   
        res.status(200).json({
            success: true,
            count: classrooms.length,
            data: classrooms
        });
    } else {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view all classrooms`, 401)
            );
        }
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get single classroom
// @route GET /api/v1/classrooms/:id
// @access Private
exports.getClassroom = asyncHandler(async (req, res, next) => {
    const classroom = await Classroom.findById(req.params.id).populate({
        path: 'owner',
        select: 'name email'
    });

    if(!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.params.id}`, 
            404
        ));
    }

    res.status(200).json({
        success: true,
        data: classroom
    });
});

// @desc Create classroom
// @route POST /api/v1/classrooms
// @access Private
exports.createClassroom = asyncHandler(async (req, res, next) => {
    // Add owner to req.body and remove code if provided (will be auto-generated)
    req.body.owner = req.user.id;
    delete req.body.code; // Ensure code is auto-generated

    const classroom = await Classroom.create(req.body);

    res.status(201).json({
        success: true,
        data: classroom
    });
});

// @desc Update classroom
// @route PUT /api/v1/classrooms/:id
// @access Private
exports.updateClassroom = asyncHandler(async (req, res, next) => {
    let classroom = await Classroom.findById(req.params.id);

    if(!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.params.id}`, 
            404
        ));
    }

    // Make sure user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this classroom`,
                401
            )
        );
    }

    classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: classroom
    });
});

// @desc Delete classroom
// @route DELETE /api/v1/classrooms/:id
// @access Private
exports.deleteClassroom = asyncHandler(async (req, res, next) => {
    const classroom = await Classroom.findById(req.params.id);

    if(!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.params.id}`, 
            404
        ));
    }

    // Make sure user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this classroom`,
                401
            )
        );
    }

    await classroom.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc Join classroom by code
// @route POST /api/v1/classrooms/join/:code
// @access Private - Students only
exports.joinClassroomByCode = asyncHandler(async (req, res, next) => {
    const { code } = req.params;

    // Only students can join classrooms
    if (req.user.role !== 'student') {
        return next(
            new ErrorResponse(
                `Only students can join classrooms. User role: ${req.user.role}`,
                403
            )
        );
    }

    const classroom = await Classroom.findByCode(code);

    if (!classroom) {
        return next(
            new ErrorResponse(`No classroom found with code: ${code}`, 404)
        );
    }

    // Check if student is already in the classroom
    const existingParticipation = await ClassroomParticipation.findOne({
        classroom: classroom._id,
        user: req.user.id
    });

    if (existingParticipation) {
        return next(
            new ErrorResponse(
                'You are already enrolled in this classroom',
                400
            )
        );
    }

    // Create participation
    const participation = await ClassroomParticipation.create({
        classroom: classroom._id,
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        message: `Successfully joined classroom: ${classroom.name}`,
        data: {
            classroom: {
                id: classroom._id,
                name: classroom.name,
                subject: classroom.subject,
                code: classroom.code
            },
            participation: participation
        }
    });
}); 