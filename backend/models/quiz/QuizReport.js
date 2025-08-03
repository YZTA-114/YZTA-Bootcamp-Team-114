const mongoose = require('mongoose');

const QuizReportSchema = new mongoose.Schema({
    quizTake: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizTake',
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    aiReport: {
        type: String,
        required: true
    },
    timeSpentMinutes: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizReport', QuizReportSchema); 