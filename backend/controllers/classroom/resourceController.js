const ErrorResponse = require('../../utils/errorResponse');
const Resource = require('../../models/classroom/Resource');
const Lesson = require('../../models/classroom/Lesson');
const Classroom = require('../../models/classroom/Classroom');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');

const asyncHandler = require('../../middleware/async');

// @desc Get all resources / Get resources by lesson
// @route GET /api/v1/resources
// @route GET /api/v1/lessons/:lessonId/resources
// @access Private
exports.getResources = asyncHandler(async (req, res, next) => {
    // Check if lessonId is provided in params (nested route)
    if (req.params.lessonId) {
        const lesson = await Lesson.findById(req.params.lessonId);

        if (!lesson) {
            return next(
                new ErrorResponse(`No lesson with the id of ${req.params.lessonId}`, 
                404
            ));
        }

        const classroom = await Classroom.findById(lesson.classroom);

        // Check if user is classroom owner, student in classroom, or admin
        const isOwner = classroom.owner.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        const isStudentInClass = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        if (!isOwner && !isAdmin && !isStudentInClass) {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to view resources in this lesson`,
                    401
                )
            );
        }

        const resources = await Resource.find({ 
            lesson: req.params.lessonId 
        }).populate([
            {
                path: 'lesson',
                populate: {
                    path: 'classroom',
                    populate: {
                        path: 'owner',
                        select: 'name email'
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });
    } else {
        // Get all resources (role-based filtering)
        if (req.user.role === 'admin') {
            res.status(200).json(res.advancedResults);
        } else {
            // For teachers: get resources from their lessons
            // For students: get resources from lessons in classrooms they participate in
            if (req.user.role === 'teacher') {
                const ownedClassrooms = await Classroom.find({ owner: req.user.id });
                const classroomIds = ownedClassrooms.map(c => c._id);
                
                const lessons = await Lesson.find({ classroom: { $in: classroomIds } });
                const lessonIds = lessons.map(l => l._id);
                
                const resources = await Resource.find({ 
                    lesson: { $in: lessonIds } 
                }).populate([
                    {
                        path: 'lesson',
                        populate: {
                            path: 'classroom',
                            populate: {
                                path: 'owner',
                                select: 'name email'
                            }
                        }
                    }
                ]);

                res.status(200).json({
                    success: true,
                    count: resources.length,
                    data: resources
                });
            } else if (req.user.role === 'student') {
                const participations = await ClassroomParticipation.find({ user: req.user.id });
                const classroomIds = participations.map(p => p.classroom);
                
                const lessons = await Lesson.find({ classroom: { $in: classroomIds } });
                const lessonIds = lessons.map(l => l._id);
                
                const resources = await Resource.find({ 
                    lesson: { $in: lessonIds } 
                }).populate([
                    {
                        path: 'lesson',
                        populate: {
                            path: 'classroom',
                            populate: {
                                path: 'owner',
                                select: 'name email'
                            }
                        }
                    }
                ]);

                res.status(200).json({
                    success: true,
                    count: resources.length,
                    data: resources
                });
            }
        }
    }
});

// @desc Get single resource
// @route GET /api/v1/resources/:id
// @access Private
exports.getResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id).populate([
        {
            path: 'lesson',
            populate: {
                path: 'classroom',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            }
        }
    ]);

    if (!resource) {
        return next(
            new ErrorResponse(`No resource with the id of ${req.params.id}`, 
            404
        ));
    }

    // Check permissions: classroom owner, student in classroom, or admin
    const lesson = await Lesson.findById(resource.lesson);
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
                `User ${req.user.id} is not authorized to view this resource`,
                401
            )
        );
    }

    res.status(200).json({
        success: true,
        data: resource
    });
});

// @desc Create resource
// @route POST /api/v1/resources
// @access Private - Classroom owner or Admin
exports.createResource = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findById(req.body.lesson);

    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson with the id of ${req.body.lesson}`, 
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
                `User ${req.user.id} is not authorized to create resources in this lesson`,
                401
            )
        );
    }

    //TODO: Upload file to storage and set the source of resource

    const resource = await Resource.create(req.body);

    res.status(201).json({
        success: true,
        data: resource
    });
});

// @desc Update resource
// @route PUT /api/v1/resources/:id
// @access Private - Classroom owner or Admin
exports.updateResource = asyncHandler(async (req, res, next) => {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(
            new ErrorResponse(`No resource with the id of ${req.params.id}`, 
            404
        ));
    }

    const lesson = await Lesson.findById(resource.lesson);
    const classroom = await Classroom.findById(lesson.classroom);

    // Check if user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this resource`,
                401
            )
        );
    }

    //TODO: Update file in storage and set the source of resource

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: resource
    });
});

// @desc Delete resource
// @route DELETE /api/v1/resources/:id
// @access Private - Classroom owner or Admin
exports.deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(
            new ErrorResponse(`No resource with the id of ${req.params.id}`, 
            404
        ));
    }

    const lesson = await Lesson.findById(resource.lesson);
    const classroom = await Classroom.findById(lesson.classroom);

    // Check if user is classroom owner or admin
    if (
        classroom.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this resource`,
                401
            )
        );
    }

    //TODO: Delete file from storage

    await resource.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

 