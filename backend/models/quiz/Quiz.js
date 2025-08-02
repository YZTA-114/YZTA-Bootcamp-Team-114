const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot be more than 500 characters"]
    },
    timeLimit: {
        type: Number,
        required: [true, "Please add a time limit in minutes"],
        default: 10,
        min: 1,
        max: 120
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: [true, "Please add a lesson"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please add a creator"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create questions virtual field
QuizSchema.virtual('questions', {
    ref: 'QuizQuestion',
    localField: '_id',
    foreignField: 'quiz',
    justOne: false
});

module.exports = mongoose.model("Quiz", QuizSchema);