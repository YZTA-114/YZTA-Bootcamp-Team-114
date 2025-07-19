const ErrorResponse = require('../../utils/errorResponse');
const Lesson = require('../../models/classroom/Lesson');
const Classroom = require('../../models/classroom/Classroom');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');

const asyncHandler = require('../../middleware/async');

// @desc Get all lessons / Get lessons by classroom
// @route GET /api/v1/lessons
// @route GET /api/v1/classrooms/:classroomId/lessons
// @access Private
exports.getLessons = asyncHandler(async (req, res, next) => {
    // Check if classroomId is provided in params (nested route)
    if (req.params.classroomId) {
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
                    `User ${req.user.id} is not authorized to view lessons in this classroom`,
                    401
                )
            );
        }

        const lessons = await Lesson.find({ 
            classroom: req.params.classroomId 
        }).populate({
            path: 'classroom',
            populate: {
                path: 'owner',
                select: 'name email'
            }
        });

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        });
    } else {
        // Get all lessons (role-based filtering)
        if (req.user.role === 'admin') {
            res.status(200).json(res.advancedResults);
        } else {
            // For teachers: get lessons from their classrooms
            // For students: get lessons from classrooms they participate in
            if (req.user.role === 'teacher') {
                const ownedClassrooms = await Classroom.find({ owner: req.user.id });
                const classroomIds = ownedClassrooms.map(c => c._id);
                
                const lessons = await Lesson.find({ 
                    classroom: { $in: classroomIds } 
                }).populate({
                    path: 'classroom',
                    populate: {
                        path: 'owner',
                        select: 'name email'
                    }
                });

                res.status(200).json({
                    success: true,
                    count: lessons.length,
                    data: lessons
                });
            } else if (req.user.role === 'student') {
                const participations = await ClassroomParticipation.find({ user: req.user.id });
                const classroomIds = participations.map(p => p.classroom);
                
                const lessons = await Lesson.find({ 
                    classroom: { $in: classroomIds } 
                }).populate({
                    path: 'classroom',
                    populate: {
                        path: 'owner',
                        select: 'name email'
                    }
                });

                res.status(200).json({
                    success: true,
                    count: lessons.length,
                    data: lessons
                });
            }
        }
    }
});

// @desc Get single lesson
// @route GET /api/v1/lessons/:id
// @access Private
exports.getLesson = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id).populate({
        path: 'classroom',
        populate: {
            path: 'owner',
            select: 'name email'
        }
    });

    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson with the id of ${req.params.id}`, 
            404
        ));
    }

    // Check permissions: classroom owner, student in classroom, or admin
    const classroom = await Classroom.findById(lesson.classroom);
    const isOwner = classroom.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isStudentInClass = await ClassroomParticipation.findOne({
        classroom: lesson.classroom,
        user: req.user.id
    });

    if (!isOwner && !isAdmin && !isStudentInClass) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to view this lesson`,
                401
            )
        );
    }

    res.status(200).json({
        success: true,
        data: lesson
    });
});

// @desc Create lesson
// @route POST /api/v1/classrooms/:classroomId/lessons
// @access Private - Classroom owner or Admin
exports.createLesson = asyncHandler(async (req, res, next) => {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
        return next(
            new ErrorResponse(`No classroom with the id of ${req.params.classroomId}`, 
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
                `User ${req.user.id} is not authorized to create lessons in this classroom`,
                401
            )
        );
    }

    const lesson = await Lesson.create({
        ...req.body,
        classroom: req.params.classroomId
    });

    res.status(201).json({
        success: true,
        data: lesson
    });
});

// @desc Update lesson
// @route PUT /api/v1/lessons/:id
// @access Private - Classroom owner or Admin
exports.updateLesson = asyncHandler(async (req, res, next) => {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson with the id of ${req.params.id}`, 
            404
        ));
    }

    const classroom = await Classroom.findById(lesson.classroom);

    // Check if user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this lesson`,
                401
            )
        );
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: lesson
    });
});

// @desc Delete lesson
// @route DELETE /api/v1/lessons/:id
// @access Private - Classroom owner or Admin
exports.deleteLesson = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson with the id of ${req.params.id}`, 
            404
        ));
    }

    const classroom = await Classroom.findById(lesson.classroom);

    // Check if user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this lesson`,
                401
            )
        );
    }

    await lesson.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

 