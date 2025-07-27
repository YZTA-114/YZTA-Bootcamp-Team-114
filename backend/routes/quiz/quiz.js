const express = require('express');
const {
    getQuizzes,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
} = require('../../controllers/quiz/quizController');

const Quiz = require('../../models/quiz/Quiz');
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
const questionRouter = require('./question');
const responseRouter = require('./response');
const quizTakeRouter = require('./quizTake');

router.use('/:quizId/quiz-questions', questionRouter);
router.use('/:quizId/quiz-responses', responseRouter);
router.use('/:quizId/quiz-takes', quizTakeRouter);  

router.use(protect);

router
    .route('/')
    .get(
        advancedResults(Quiz, [
            { path: 'lesson', select: 'name description' },
            { path: 'createdBy', select: 'email' }
        ]),
        getQuizzes
    )
    .post(authorize('teacher', 'admin'), createQuiz);

router
    .route('/:id')
    .get(getQuiz)
    .put(authorize('teacher', 'admin'), updateQuiz)
    .delete(authorize('teacher', 'admin'), deleteQuiz);

module.exports = router; 