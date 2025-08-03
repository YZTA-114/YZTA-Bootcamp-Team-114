const express = require('express');
const {
    getQuizReports,
    getQuizReport,
    getQuizTakeReports,
    createQuizReport,
    updateQuizReport,
    deleteQuizReport
} = require('../../controllers/quiz/quizReportController');

const router = express.Router({ mergeParams: true });

const { protect } = require('../../middleware/auth');

// Routes for /api/v1/quiz-reports
router
    .route('/')
    .get(protect, getQuizReports)
    .post(protect, createQuizReport);

router
    .route('/:id')
    .get(protect, getQuizReport)
    .put(protect, updateQuizReport)
    .delete(protect, deleteQuizReport);
module.exports = router; 