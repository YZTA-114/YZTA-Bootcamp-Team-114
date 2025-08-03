const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Please add a content"]
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Please add a quiz"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create options virtual field
QuizQuestionSchema.virtual('options', {
    ref: 'QuizAnswerOption',
    localField: '_id',
    foreignField: 'question',
    justOne: false
});

module.exports = mongoose.model("QuizQuestion", QuizQuestionSchema);