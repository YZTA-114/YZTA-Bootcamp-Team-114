const ErrorResponse = require('../../utils/errorResponse');
const QuizResponse = require('../../models/quiz/QuizResponse');
const QuizTake = require('../../models/quiz/QuizTake');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const QuizAnswerOption = require('../../models/quiz/QuizAnswerOption');
const Quiz = require('../../models/quiz/Quiz');
const asyncHandler = require('../../middleware/async');

// @desc Get all responses for a quiz take
// @route GET /api/v1/quiz-takes/:quizTakeId/responses
// @access Private - Only owner of the take or quiz creator can view responses
exports.getResponses = asyncHandler(async (req, res, next) => {
    const quizTake = await QuizTake.findById(req.params.quizTakeId);
    if (!quizTake) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.quizTakeId}`, 404)
        );
    }

    // Check if user owns the take or is quiz creator or admin
    const quiz = await Quiz.findById(quizTake.quiz);
    if (quizTake.user.toString() !== req.user.id && 
        quiz.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to view these responses`, 401)
        );
    }

    const responses = await QuizResponse.find({ quizTake: req.params.quizTakeId })
        .populate([
            {
                path: 'quizQuestion',
                select: 'content'
            },
            {
                path: 'answerOption',
                select: 'content isCorrect'
            }
        ]);

    res.status(200).json({
        success: true,
        count: responses.length,
        data: responses
    });
});

// @desc Get single response
// @route GET /api/v1/responses/:id
// @access Private - Only owner of the take or quiz creator can view response
exports.getResponse = asyncHandler(async (req, res, next) => {
    const response = await QuizResponse.findById(req.params.id)
        .populate([
            {
                path: 'quizQuestion',
                select: 'content'
            },
            {
                path: 'answerOption',
                select: 'content isCorrect'
            },
            {
                path: 'quizTake',
                select: 'quiz user'
            }
        ]);

    if (!response) {
        return next(
            new ErrorResponse(`No response found with id of ${req.params.id}`, 404)
        );
    }

    const quizTake = await QuizTake.findById(response.quizTake);
    const quiz = await Quiz.findById(quizTake.quiz);

    // Check if user owns the take or is quiz creator or admin
    if (quizTake.user.toString() !== req.user.id && 
        quiz.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to view this response`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: response
    });
});

// @desc Create response
// @route POST /api/v1/takes/:quizTakeId/responses
// @access Private - Only owner of the take can create responses
exports.createResponse = asyncHandler(async (req, res, next) => {
    req.body.quizTake = req.params.quizTakeId;

    const quizTake = await QuizTake.findById(req.params.quizTakeId);

    if (!quizTake) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.quizTakeId}`, 404)
        );
    }

    // Only the owner of the take can submit responses
    if (quizTake.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to submit responses for this quiz take`, 401)
        );
    }

    // Verify question belongs to the quiz
    const question = await QuizQuestion.findById(req.body.quizQuestion);
    if (!question) {
        return next(
            new ErrorResponse(`No question found with id of ${req.body.quizQuestion}`, 404)
        );
    }

    const quiz = await Quiz.findById(quizTake.quiz);
    if (question.quiz.toString() !== quiz._id.toString()) {
        return next(
            new ErrorResponse(`Question does not belong to this quiz`, 400)
        );
    }

    // Verify answer option belongs to the question
    const answerOption = await QuizAnswerOption.findById(req.body.answerOption);
    if (!answerOption || answerOption.question.toString() !== req.body.quizQuestion) {
        return next(
            new ErrorResponse(`Answer option does not belong to this question`, 400)
        );
    }

    // Check if question is already answered
    const existingResponse = await QuizResponse.findOne({
        quizTake: req.params.quizTakeId,
        quizQuestion: req.body.quizQuestion
    });

    let response;

    // If question is already answered, update the response
    if(existingResponse) {
        existingResponse.answerOption = req.body.answerOption;
        await existingResponse.save();
        response = existingResponse;
    } else {
        response = await QuizResponse.create(req.body);
    }

    res.status(201).json({
        success: true,
        data: response
    });
});

// @desc Update response
// @route PUT /api/v1/responses/:id
// @access Private - Only owner of the take can update responses
exports.updateResponse = asyncHandler(async (req, res, next) => {
    let response = await QuizResponse.findById(req.params.id);

    if (!response) {
        return next(
            new ErrorResponse(`No response found with id of ${req.params.id}`, 404)
        );
    }

    const quizTake = await QuizTake.findById(response.quizTake);

    // Only the owner of the take can update responses
    if (quizTake.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this response`, 401)
        );
    }

    // If changing answer option, verify it belongs to the question
    if (req.body.answerOption) {
        const answerOption = await QuizAnswerOption.findById(req.body.answerOption);
        if (!answerOption || answerOption.question.toString() !== response.quizQuestion.toString()) {
            return next(
                new ErrorResponse(`Answer option does not belong to this question`, 400)
            );
        }
    }

    response = await QuizResponse.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: response
    });
});

// @desc Delete response
// @route DELETE /api/v1/responses/:id
// @access Private - Only owner of the take can delete responses
exports.deleteResponse = asyncHandler(async (req, res, next) => {
    const response = await QuizResponse.findById(req.params.id);

    if (!response) {
        return next(
            new ErrorResponse(`No response found with id of ${req.params.id}`, 404)
        );
    }

    const quizTake = await QuizTake.findById(response.quizTake);

    // Only the owner of the take can delete responses
    if (quizTake.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete this response`, 401)
        );
    }

    await response.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 