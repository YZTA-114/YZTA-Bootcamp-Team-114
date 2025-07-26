const ErrorResponse = require('../../utils/errorResponse');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const Quiz = require('../../models/quiz/Quiz');
const Lesson = require('../../models/classroom/Lesson');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const asyncHandler = require('../../middleware/async');

// @desc Get all questions for a quiz
// @route GET /api/v1/quizzes/:quizId/questions
// @access Private - Teachers can view their quiz questions, students can view questions of quizzes in their enrolled classrooms
exports.getQuestions = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.quizId}`, 404)
        );
    }

    // If user is not admin or quiz creator, check classroom participation
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        const lesson = await Lesson.findById(quiz.lesson);
        if (!lesson) {
            return next(
                new ErrorResponse(`No lesson found for this quiz`, 404)
            );
        }

        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        if (!isParticipant) {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view questions of this quiz`, 401)
            );
        }
    }

    const questions = await QuizQuestion.find({ quiz: req.params.quizId });

    res.status(200).json({
        success: true,
        count: questions.length,
        data: questions
    });
});

// @desc Get single question
// @route GET /api/v1/questions/:id
// @access Private - Teachers can view their quiz questions, students can view questions of quizzes in their enrolled classrooms
exports.getQuestion = asyncHandler(async (req, res, next) => {
    const question = await QuizQuestion.findById(req.params.id).populate({
        path: 'quiz',
        select: 'name description createdBy lesson'
    });

    if (!question) {
        return next(
            new ErrorResponse(`No question found with id of ${req.params.id}`, 404)
        );
    }

    // If user is not admin or quiz creator, check classroom participation
    if (question.quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        const lesson = await Lesson.findById(question.quiz.lesson);
        if (!lesson) {
            return next(
                new ErrorResponse(`No lesson found for this quiz`, 404)
            );
        }

        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        if (!isParticipant) {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view this question`, 401)
            );
        }
    }

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc Create question
// @route POST /api/v1/quizzes/:quizId/questions
// @access Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
    req.body.quiz = req.params.quizId;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.quizId}`, 404)
        );
    }

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add questions to this quiz`, 401)
        );
    }

    const question = await QuizQuestion.create(req.body);

    res.status(201).json({
        success: true,
        data: question
    });
});

// @desc Update question
// @route PUT /api/v1/questions/:id
// @access Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await QuizQuestion.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`No question found with id of ${req.params.id}`, 404)
        );
    }

    const quiz = await Quiz.findById(question.quiz);

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this question`, 401)
        );
    }

    question = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: question
    });
});

// @desc Delete question
// @route DELETE /api/v1/questions/:id
// @access Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const question = await QuizQuestion.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`No question found with id of ${req.params.id}`, 404)
        );
    }

    const quiz = await Quiz.findById(question.quiz);

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete this question`, 401)
        );
    }

    await question.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 