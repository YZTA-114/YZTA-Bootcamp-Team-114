const express = require('express');
const advancedResults = require('../../middleware/advancedResults');
const QuizResponse = require('../../models/quiz/QuizResponse');
const {
    getResponses,
    getResponse,
    createResponse,
    updateResponse,
    deleteResponse
} = require('../../controllers/quiz/quizResponseController');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(advancedResults(QuizResponse, [
        { path: 'quizTake', select: 'id' },
        { path: 'quizQuestion', select: 'question' }
    ]), getResponses)
    .post(authorize('student', 'admin'), createResponse);

router
    .route('/:id')
    .get(getResponse)
    .put(authorize('student', 'admin'), updateResponse)
    .delete(authorize('student', 'admin'), deleteResponse);

module.exports = router; 