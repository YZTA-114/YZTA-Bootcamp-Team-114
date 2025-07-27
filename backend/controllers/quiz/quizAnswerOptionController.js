const ErrorResponse = require('../../utils/errorResponse');
const QuizAnswerOption = require('../../models/quiz/QuizAnswerOption');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const Quiz = require('../../models/quiz/Quiz');
const asyncHandler = require('../../middleware/async');

// @desc Get all answer options for a question
// @route GET /api/v1/questions/:questionId/options
// @access Private
exports.getAnswerOptions = asyncHandler(async (req, res, next) => {
    const options = await QuizAnswerOption.find({ question: req.params.questionId });

    res.status(200).json({
        success: true,
        count: options.length,
        data: options
    });
});

// @desc Get single answer option
// @route GET /api/v1/options/:id
// @access Private
exports.getAnswerOption = asyncHandler(async (req, res, next) => {
    const option = await QuizAnswerOption.findById(req.params.id).populate({
        path: 'question',
        select: 'content quiz'
    });

    if (!option) {
        return next(
            new ErrorResponse(`No answer option found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: option
    });
});

// @desc Create answer option
// @route POST /api/v1/questions/:questionId/options
// @access Private
exports.createAnswerOption = asyncHandler(async (req, res, next) => {
    req.body.question = req.params.questionId;

    const question = await QuizQuestion.findById(req.params.questionId);

    if (!question) {
        return next(
            new ErrorResponse(`No question found with id of ${req.params.questionId}`, 404)
        );
    }

    const quiz = await Quiz.findById(question.quiz);

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add answer options to this question`, 401)
        );
    }

    const option = await QuizAnswerOption.create(req.body);

    res.status(201).json({
        success: true,
        data: option
    });
});

// @desc Update answer option
// @route PUT /api/v1/options/:id
// @access Private
exports.updateAnswerOption = asyncHandler(async (req, res, next) => {
    let option = await QuizAnswerOption.findById(req.params.id);

    if (!option) {
        return next(
            new ErrorResponse(`No answer option found with id of ${req.params.id}`, 404)
        );
    }

    const question = await QuizQuestion.findById(option.question);
    const quiz = await Quiz.findById(question.quiz);

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this answer option`, 401)
        );
    }

    option = await QuizAnswerOption.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: option
    });
});

// @desc Delete answer option
// @route DELETE /api/v1/options/:id
// @access Private
exports.deleteAnswerOption = asyncHandler(async (req, res, next) => {
    const option = await QuizAnswerOption.findById(req.params.id);

    if (!option) {
        return next(
            new ErrorResponse(`No answer option found with id of ${req.params.id}`, 404)
        );
    }

    const question = await QuizQuestion.findById(option.question);
    const quiz = await Quiz.findById(question.quiz);

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete this answer option`, 401)
        );
    }

    await option.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 