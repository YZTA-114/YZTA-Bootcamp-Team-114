const mongoose = require("mongoose");

const QuizTakeSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Please add a quiz"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please add a user"]
    },
    status: {
        type: String,
        enum: ['uncompleted', 'completed', 'expired'],
        default: 'uncompleted'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    // TODO: add expiration time
    completedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("QuizTake", QuizTakeSchema);