const express = require('express');
const advancedResults = require('../../middleware/advancedResults');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const {
    getQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestions,
    createQuestion
} = require('../../controllers/quiz/quizQuestionController');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
    .get(advancedResults(QuizQuestion, [
        { path: 'quiz', select: 'name' }
    ]), getQuestions)
    .post(authorize('teacher', 'admin'), createQuestion);

router
    .route('/:id')
    .get(getQuestion)
    .put(authorize('teacher', 'admin'), updateQuestion)
    .delete(authorize('teacher', 'admin'), deleteQuestion);

module.exports = router; 