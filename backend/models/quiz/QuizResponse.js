const mongoose = require("mongoose");

const QuizResponseSchema = new mongoose.Schema({
    quizQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizQuestion",
        required: [true, "Please add a quiz question"]
    },
    quizTake: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizTake",
        required: [true, "Please add a quiz take"]
    },
    answerOption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizAnswerOption",
        required: [true, "Please add an answer option"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("QuizResponse", QuizResponseSchema);