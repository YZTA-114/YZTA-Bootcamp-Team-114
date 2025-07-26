const mongoose = require("mongoose");

const QuizAnswerOptionSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizQuestion",
        required: [true, "Please add a question"]
    },
    explanation: {
        type: String,
        required: [true, "Please add an explanation"]
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: [true, "Please add a content"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("QuizAnswerOption", QuizAnswerOptionSchema);