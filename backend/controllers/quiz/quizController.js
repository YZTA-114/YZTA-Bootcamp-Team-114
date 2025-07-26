const ErrorResponse = require('../../utils/errorResponse');
const Quiz = require('../../models/quiz/Quiz');
const Lesson = require('../../models/classroom/Lesson');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const asyncHandler = require('../../middleware/async');

// @desc Get all quizzes
// @route GET /api/v1/quizzes
// @route GET /api/v1/lessons/:lessonId/quizzes
// @access Private
exports.getQuizzes = asyncHandler(async (req, res, next) => {
    if (req.params.lessonId) {
        // Check if user has access to the lesson through classroom participation
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) {
            return next(
                new ErrorResponse(`No lesson found with id of ${req.params.lessonId}`, 404)
            );
        }

        // Check if user is a participant in the classroom or is the creator/admin
        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
        const isCreator = quiz && quiz.createdBy.toString() === req.user.id;

        if (!isParticipant && !isCreator && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view quizzes in this lesson`, 401)
            );
        }

        const quizzes = await Quiz.find({ lesson: req.params.lessonId });
        
        return res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } else {
        // Only admin can view all quizzes
        if (req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view all quizzes`, 401)
            );
        }
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get single quiz
// @route GET /api/v1/quizzes/:id
// @access Private
exports.getQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate([
        {
            path: 'createdBy',
            select: 'email'
        },
        {
            path: 'lesson',
            select: 'name'
        }
    ]);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Get lesson and check classroom participation for students
    const lesson = await Lesson.findById(quiz.lesson);
    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson found for this quiz`, 404)
        );
    }

    // If user is not admin or quiz creator, check classroom participation
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        if (!isParticipant) {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view this quiz`, 401)
            );
        }
    }

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc Create quiz
// @route POST /api/v1/lessons/:lessonId/quizzes
// @access Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
    req.body.lesson = req.params.lessonId;
    req.body.createdBy = req.user.id;

    // Check if teacher is owner of the classroom of the lesson
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson found with id of ${req.params.lessonId}`, 404)
        );
    }
    const isOwner = lesson.owner.toString() === req.user.id;

    if(!isOwner && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to create a quiz in this lesson`, 401)
        );
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
        success: true,
        data: quiz
    });
});

// @desc Update quiz
// @route PUT /api/v1/quizzes/:id
// @access Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this quiz`, 401)
        );
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc Delete quiz
// @route DELETE /api/v1/quizzes/:id
// @access Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete this quiz`, 401)
        );
    }

    await quiz.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 