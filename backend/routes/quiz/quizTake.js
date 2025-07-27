const express = require('express');
const advancedResults = require('../../middleware/advancedResults');
const QuizTake = require('../../models/quiz/QuizTake');
const {
    getQuizTakes,
    getMyQuizTakes,
    getQuizTake,
    createQuizTake,
    deleteQuizTake
} = require('../../controllers/quiz/quizTakeController');

const { protect, authorize } = require('../../middleware/auth');

// Include response router
const responseRouter = require('./response');

const router = express.Router({ mergeParams: true });

// Re-route into response router
router.use('/:quizTakeId/quiz-responses', responseRouter);

router.use(protect);

router
    .route('/')
    .get(authorize('teacher', 'admin'),  advancedResults(QuizTake, [
        { path: 'quiz', select: 'name' },
        { path: 'user', select: 'email' }
    ]), getQuizTakes)
    .post(authorize('student'), createQuizTake);

router.route('/me').get(authorize('student'), getMyQuizTakes);

router
    .route('/:id')
    .get(getQuizTake)
    .delete(authorize('admin'), deleteQuizTake);

module.exports = router; 