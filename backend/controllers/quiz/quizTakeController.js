const ErrorResponse = require('../../utils/errorResponse');
const QuizTake = require('../../models/quiz/QuizTake');
const Quiz = require('../../models/quiz/Quiz');
const Lesson = require('../../models/classroom/Lesson');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const asyncHandler = require('../../middleware/async');

// @desc Get all takes for a quiz
// @route GET /api/v1/quizzes/:quizId/quiz-takes
// @access Private - Only teachers can get quiz takes of their quizzes
exports.getQuizTakes = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.quizId}`, 404)
        );
    }
    
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to view this quiz takes`, 401)
        );
    }

    const takes = await QuizTake.find({ quiz: req.params.quizId })
        .populate([
            {
                path: 'user',
                select: 'email'
            }
        ]);

    res.status(200).json({
        success: true,
        count: takes.length,
        data: takes
    });
});

// @desc Get all takes for current user
// @route GET /api/v1/quiz-takes/me
// @access Private
exports.getMyQuizTakes = asyncHandler(async (req, res, next) => {
    const takes = await QuizTake.find({ user: req.user.id })
        .populate([
            {
                path: 'quiz',
                select: '*'
            }
        ]);

    res.status(200).json({
        success: true,
        count: takes.length,
        data: takes
    });
});

// @desc Get single take
// @route GET /api/v1/quiz-takes/:id
// @access Private
exports.getQuizTake = asyncHandler(async (req, res, next) => {
    const take = await QuizTake.findById(req.params.id)
        .populate([
            {
                path: 'quiz',
                select: '*'
            },
            {
                path: 'user',
                select: 'email'
            }
        ]);

    if (!take) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns the take or is admin or is quiz creator
    const quiz = await Quiz.findById(take.quiz);
    if (take.user.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        quiz.createdBy.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to view this quiz take`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: take
    });
});

// @desc Create take
// @route POST /api/v1/quizzes/:quizId/quiz-takes
// @access Private - Students only
exports.createQuizTake = asyncHandler(async (req, res, next) => {
    req.body.quiz = req.params.quizId;
    req.body.user = req.user.id;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.quizId}`, 404)
        );
    }

    // Check if student has access to the quiz through classroom participation
    const lesson = await Lesson.findById(quiz.lesson);
    const isParticipant = await ClassroomParticipation.findOne({
        classroom: lesson.classroom,
        user: req.user.id
    });

    if (!isParticipant) {
        return next(
            new ErrorResponse(`You must be enrolled in the classroom to take this quiz`, 403)
        );
    }

    // Check if user already has an active take for this quiz
    const existingTake = await QuizTake.findOne({
        quiz: req.params.quizId,
        user: req.user.id
    });

    if (existingTake) {
        return next(
            new ErrorResponse(`You already have an active take for this quiz`, 400)
        );
    }

    const take = await QuizTake.create(req.body);

    res.status(201).json({
        success: true,
        data: take
    });
});

// @desc Update take
// @route PUT /api/v1/quiz-takes/:id
// @access Private - Only owner of the take can update it
exports.updateQuizTake = asyncHandler(async (req, res, next) => {
    let take = await QuizTake.findById(req.params.id);

    if (!take) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns the take or is admin
    if (take.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this quiz take`, 401)
        );
    }

    take = await QuizTake.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: take
    });
});

// @desc Delete take
// @route DELETE /api/v1/takes/:id
// @access Private - Admin only
exports.deleteQuizTake = asyncHandler(async (req, res, next) => {
    const take = await QuizTake.findById(req.params.id);

    if (!take) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.id}`, 404)
        );
    }

    // Only admin can delete quiz takes
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete quiz takes`, 401)
        );
    }

    await take.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 