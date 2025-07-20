const ErrorResponse = require('../../utils/errorResponse');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const Classroom = require('../../models/classroom/Classroom');

const asyncHandler = require('../../middleware/async');

// @desc Get all classroom participations / Get participations by user
// @route GET /api/v1/classroomParticipations
// @route GET /api/v1/users/:userId/classroomParticipations
// @access Private - Admin only / User themselves or Admin
exports.getClassroomParticipations = asyncHandler(async (req, res, next) => {
    // Check if userId is provided in params (nested route)
    if (req.params.userId) {
        const userId = req.params.userId;

        // Check if user is requesting their own participations or is admin
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to access participations of user ${userId}`,
                    401
                )
            );
        }

        const participations = await ClassroomParticipation.find({ 
            user: userId 
        }).populate([
            {
                path: 'classroom',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: participations.length,
            data: participations
        });
    } else {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view all classroom participations`, 401)
            );
        }

        // Get all classroom participations (admin only)
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get single classroom participation
// @route GET /api/v1/classroom-participations/:id
// @access Private
exports.getClassroomParticipation = asyncHandler(async (req, res, next) => {
    const participation = await ClassroomParticipation.findById(req.params.id).populate([
        {
            path: 'classroom',
            populate: {
                path: 'owner',
                select: 'name email'
            }
        },
        {
            path: 'user',
            select: 'name email role'
        }
    ]);

    if (!participation) {
        return next(
            new ErrorResponse(`No classroom participation with the id of ${req.params.id}`, 
            404
        ));
    }

    // Check permissions: user can view their own participation, classroom owner, or admin
    const classroom = await Classroom.findById(participation.classroom);
    if (
        participation.user.toString() !== req.user.id &&
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to view this participation`,
                401
            )
        );
    }

    res.status(200).json({
        success: true,
        data: participation
    });
});

// @desc Create classroom participation
// @route POST /api/v1/classroom-participations
// @access Private - Classroom owner or Admin
exports.createClassroomParticipation = asyncHandler(async (req, res, next) => {
    const classroom = await Classroom.findById(req.body.classroom);

    if (!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.body.classroom}`, 
            404
        ));
    }

    // Check if user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add students to this classroom`,
                401
            )
        );
    }

    // Check if student is already in the classroom
    const existingParticipation = await ClassroomParticipation.findOne({
        classroom: req.body.classroom,
        user: req.body.user
    });

    if (existingParticipation) {
        return next(
            new ErrorResponse(
                `Student is already enrolled in this classroom`,
                400
            )
        );
    }

    const participation = await ClassroomParticipation.create(req.body);

    res.status(201).json({
        success: true,
        data: participation
    });
});

// @desc Update classroom participation
// @route PUT /api/v1/classroom-participations/:id
// @access Private - Admin only (limited use case)
exports.updateClassroomParticipation = asyncHandler(async (req, res, next) => {
    let participation = await ClassroomParticipation.findById(req.params.id);

    if (!participation) {
        return next(
            new ErrorResponse(`No classroom participation with the id of ${req.params.id}`, 
            404
        ));
    }

    // Only admin can update participations
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this participation`,
                401
            )
        );
    }

    participation = await ClassroomParticipation.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: participation
    });
});

// @desc Delete classroom participation
// @route DELETE /api/v1/classroom-participations/:id
// @access Private - Classroom owner, student themselves, or Admin
exports.deleteClassroomParticipation = asyncHandler(async (req, res, next) => {
    const participation = await ClassroomParticipation.findById(req.params.id);

    if (!participation) {
        return next(
            new ErrorResponse(`No classroom participation with the id of ${req.params.id}`, 
            404
        ));
    }

    const classroom = await Classroom.findById(participation.classroom);

    // Check permissions: student can remove themselves, classroom owner, or admin
    if (
        participation.user.toString() !== req.user.id &&
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to remove this participation`,
                401
            )
        );
    }

    await participation.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc Get participations by classroom
// @route GET /api/v1/classrooms/:classroomId/participations
// @access Private - Classroom owner, students in classroom, or Admin
exports.getClassroomParticipationsByClassroom = asyncHandler(async (req, res, next) => {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.params.classroomId}`, 
            404
        ));
    }

    // Check if user is classroom owner, student in classroom, or admin
    const isOwner = classroom.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isStudentInClass = await ClassroomParticipation.findOne({
        classroom: req.params.classroomId,
        user: req.user.id
    });

    if (!isOwner && !isAdmin && !isStudentInClass) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to view participations in this classroom`,
                401
            )
        );
    }

    const participations = await ClassroomParticipation.find({ 
        classroom: req.params.classroomId 
    }).populate([
        {
            path: 'user',
            select: 'name email role'
        }
    ]);

    res.status(200).json({
        success: true,
        count: participations.length,
        data: participations
    });
});

 