const ErrorResponse = require('../../utils/errorResponse');
const QuizReport = require('../../models/quiz/QuizReport');
const QuizTake = require('../../models/quiz/QuizTake');
const asyncHandler = require('../../middleware/async');

// @desc    Get all quiz reports or quiz reports for a specific quiz take
// @route   GET /api/v1/quiz-reports
// @route   GET /api/v1/quiz-takes/:quizTakeId/quiz-reports
// @access  Private
exports.getQuizReports = asyncHandler(async (req, res, next) => {
    if (req.params.quizTakeId) {
        // Get reports for a specific quiz take
        const quizTake = await QuizTake.findById(req.params.quizTakeId);
        
        if (!quizTake) {
            return next(
                new ErrorResponse(`No quiz take found with id of ${req.params.quizTakeId}`, 404)
            );
        }

        // Check if user owns the quiz take or is admin
        if (quizTake.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view reports for this quiz take`, 401)
            );
        }

        const reports = await QuizReport.find({ quizTake: req.params.quizTakeId }).populate({
            path: 'quizTake',
            populate: {
                path: 'quiz user',
                select: 'name email'
            }
        });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } else {
        // Get all quiz reports (admin only)
        if (req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view all quiz reports`, 401)
            );
        }

        const reports = await QuizReport.find().populate({
            path: 'quizTake',
            populate: {
                path: 'quiz user',
                select: 'name email'
            }
        });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    }
});

// @desc    Get quiz report by ID
// @route   GET /api/v1/quiz-reports/:id
// @access  Private
exports.getQuizReport = asyncHandler(async (req, res, next) => {
    const report = await QuizReport.findById(req.params.id).populate({
        path: 'quizTake',
        populate: {
            path: 'quiz user',
            select: 'name email'
        }
    });

    if (!report) {
        return next(
            new ErrorResponse(`No quiz report found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user owns the report or is admin
    const quizTake = await QuizTake.findById(report.quizTake);
    if (quizTake.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to view this quiz report`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: report
    });
});

// @desc    Create quiz report
// @route   POST /api/v1/quiz-takes/:quizTakeId/quiz-reports
// @access  Private
exports.createQuizReport = asyncHandler(async (req, res, next) => {
    req.body.quizTake = req.params.quizTakeId;

    const quizTake = await QuizTake.findById(req.params.quizTakeId);
    
    if (!quizTake) {
        return next(
            new ErrorResponse(`No quiz take found with id of ${req.params.quizTakeId}`, 404)
        );
    }

    // Check if user owns the quiz take or is admin
    if (quizTake.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to create report for this quiz take`, 401)
        );
    }

    const report = await QuizReport.create(req.body);

    res.status(201).json({
        success: true,
        data: report
    });
});

// @desc    Update quiz report
// @route   PUT /api/v1/quiz-reports/:id
// @access  Private
exports.updateQuizReport = asyncHandler(async (req, res, next) => {
    let report = await QuizReport.findById(req.params.id);

    if (!report) {
        return next(
            new ErrorResponse(`No quiz report found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user owns the report or is admin
    const quizTake = await QuizTake.findById(report.quizTake);
    if (quizTake.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this quiz report`, 401)
        );
    }

    report = await QuizReport.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: report
    });
});

// @desc    Delete quiz report
// @route   DELETE /api/v1/quiz-reports/:id
// @access  Private - Admin only
exports.deleteQuizReport = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete quiz reports`, 401)
        );
    }

    const report = await QuizReport.findById(req.params.id);

    if (!report) {
        return next(
            new ErrorResponse(`No quiz report found with id of ${req.params.id}`, 404)
        );
    }

    await report.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 