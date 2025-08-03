const ErrorResponse = require('../../utils/errorResponse');
const Quiz = require('../../models/quiz/Quiz');
const Lesson = require('../../models/classroom/Lesson');
const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const asyncHandler = require('../../middleware/async');
const { transaction } = require('../../middleware/transaction');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const QuizAnswerOption = require('../../models/quiz/QuizAnswerOption');
const QuizTake = require('../../models/quiz/QuizTake');
const QuizResponse = require('../../models/quiz/QuizResponse');
const QuizReport = require('../../models/quiz/QuizReport');
const aiService = require('../../services/ai.service');

// @desc Get all quizzes
// @route GET /api/v1/quizzes
// @route GET /api/v1/lessons/:lessonId/quizzes
// @route GET /api/v1/classrooms/:classroomId/quizzes
// @access Private
exports.getQuizzes = asyncHandler(async (req, res, next) => {
    if (req.params.classroomId) {
        // Get all quizzes for a classroom
        const classroomId = req.params.classroomId;

        // Check if user has access to the classroom
        const participation = await ClassroomParticipation.findOne({
            classroom: classroomId,
            user: req.user.id
        });

        if (!participation && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view quizzes in this classroom`, 401)
            );
        }

        // Get all lessons for the classroom
        const lessons = await Lesson.find({ classroom: classroomId });
        const lessonIds = lessons.map(lesson => lesson._id);

        // Get all quizzes for these lessons
        let quizzes = await Quiz.find({ lesson: { $in: lessonIds } })
            .populate([
                {
                    path: 'createdBy',
                    select: 'email role'
                },
                {
                    path: 'lesson',
                    select: 'name'
                },
                {
                    path: 'questions',
                    populate: {
                        path: 'options',
                        model: 'QuizAnswerOption'
                    }
                }
            ]);

        // Filter quizzes based on user role
        if (req.user.role === 'student') {
            // Students can see all quizzes (both teacher and student created)
            quizzes = quizzes.filter(quiz => 
                quiz.createdBy.role === 'teacher' || // Show all teacher quizzes
                quiz.createdBy._id.toString() === req.user.id // Show only their own quizzes if student-created
            );
        } else if (req.user.role === 'teacher') {
            // Teachers can only see teacher-created quizzes
            quizzes = quizzes.filter(quiz => 
                quiz.createdBy.role === 'teacher'
            );
        }

        return res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } else if (req.params.lessonId) {
        // Check if user has access to the lesson through classroom participation
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) {
            return next(
                new ErrorResponse(`No lesson found with id of ${req.params.lessonId}`, 404)
            );
        }

        // Check if user is a participant in the classroom or is the creator/admin
        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
        const isCreator = quiz && quiz.createdBy.toString() === req.user.id;

        if (!isParticipant && !isCreator && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view quizzes in this lesson`, 401)
            );
        }

        const quizzes = await Quiz.find({ lesson: req.params.lessonId });
        
        return res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } else {
        // Only admin can view all quizzes
        if (req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view all quizzes`, 401)
            );
        }
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get single quiz
// @route GET /api/v1/quizzes/:id
// @access Private
exports.getQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate([
        {
            path: 'createdBy',
            select: 'email'
        },
        {
            path: 'lesson',
            select: 'name'
        },
        {
            path: 'questions',
            populate: {
                path: 'options',
                model: 'QuizAnswerOption',
                select: 'content isCorrect'
            }
        }
    ]);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Get lesson and check classroom participation for students
    const lesson = await Lesson.findById(quiz.lesson);
    if (!lesson) {
        return next(
            new ErrorResponse(`No lesson found for this quiz`, 404)
        );
    }

    // If user is not admin or quiz creator, check classroom participation
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        const isParticipant = await ClassroomParticipation.findOne({
            classroom: lesson.classroom,
            user: req.user.id
        });

        if (!isParticipant) {
            return next(
                new ErrorResponse(`User ${req.user.id} is not authorized to view this quiz`, 401)
            );
        }
    }

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc Create quiz
// @route POST /api/v1/lessons/:lessonId/quizzes
// @access Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
    const createQuizTransaction = async (req, res, session) => {
        const lessonId = req.params.lessonId;
        const { name, description, questions, timeLimit } = req.body;
        console.log("questions", questions);
        // Check if lesson exists
        const lesson = await Lesson.findById(lessonId).session(session);
        if (!lesson) {
            throw new ErrorResponse(`No lesson found with id of ${lessonId}`, 404);
        }

        // Create quiz
        const quiz = await Quiz.create([{
            name,
            description,
            lesson: lessonId,
            createdBy: req.user.id,
            timeLimit
        }], { session });

        const createdQuiz = quiz[0]; // Create returns an array

        // Create questions and answer options
        const createdQuestions = [];
        for (const questionData of questions) {
            // Create question
            const [question] = await QuizQuestion.create([{
                quiz: createdQuiz._id,
                content: questionData.question,
                type: 'multiple_choice', // Default to multiple choice
                points: 1 // Default points
            }], { session });

            // Create answer options
            const answerOptions = await Promise.all(questionData.options.map(async (optionData) => {
                console.log(optionData);
                const [option] = await QuizAnswerOption.create([{
                    question: question._id,
                    content: optionData.content,
                    isCorrect: optionData.isCorrect,
                    explanation: optionData.explanation, // Add explanation field
                }], { session });
                return option;
            }));

            question.options = answerOptions.map(opt => opt._id);
            await question.save({ session });
            createdQuestions.push(question);
        }

        // Add questions to quiz
        createdQuiz.questions = createdQuestions.map(q => q._id);
        await createdQuiz.save({ session });

        // Fetch complete quiz with populated data
        const populatedQuiz = await Quiz.findById(createdQuiz._id)
            .populate({
                path: 'questions',
                populate: {
                    path: 'options',
                    model: 'QuizAnswerOption'
                }
            })
            .populate('createdBy', 'email role')
            .populate('lesson', 'name')
            .session(session);

        res.status(201).json({
            success: true,
            data: populatedQuiz
        });
    };

    // Execute with transaction
    await transaction(createQuizTransaction)(req, res, next);
});

// @desc Update quiz
// @route PUT /api/v1/quizzes/:id
// @access Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this quiz`, 401)
        );
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc Delete quiz
// @route DELETE /api/v1/quizzes/:id
// @access Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(
            new ErrorResponse(`No quiz found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is quiz creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete this quiz`, 401)
        );
    }

    await quiz.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
}); 

// @desc Submit a quiz with answers
// @route POST /api/v1/quizzes/:quizTakeId/submit
// @access Private
exports.submitQuiz = asyncHandler(async (req, res, next) => {
    const submitQuizTransaction = async (req, res, session) => {
        const { quizTakeId } = req.params;
        const { answers } = req.body;

        // Find the quiz take
        const quizTake = await QuizTake.findById(quizTakeId)
            .populate({
                path: 'quiz',
                populate: {
                    path: 'questions',
                    populate: {
                        path: 'options'
                    }
                }
            })
            .session(session);

        if (!quizTake) {
            throw new ErrorResponse(`No quiz take found with id of ${quizTakeId}`, 404);
        }

        // Check if user is authorized to submit this quiz take
        if (quizTake.user.toString() !== req.user.id) {
            throw new ErrorResponse(`User ${req.user.id} is not authorized to submit this quiz take`, 401);
        }

        // Check if quiz take is already completed
        if (quizTake.status === 'completed') {
            throw new ErrorResponse(`Quiz take ${quizTakeId} is already completed`, 400);
        }

        // Create quiz responses for each answer
        const responses = await Promise.all(
            answers.map(async (answer) => {
                const response = await QuizResponse.create([{
                    quizTake: quizTakeId,
                    quizQuestion: answer.questionId,
                    answerOption: answer.answerOption
                }], { session });
                return response[0]; // Return the first element since create returns an array
            })
        );

        // Calculate time spent
        const startTime = new Date(quizTake.startedAt);
        const endTime = new Date();
        const timeSpentMinutes = Math.round((endTime - startTime) / (1000 * 60));

        // Calculate correct answers and collect question details
        let correctAnswers = 0;
        const correctQuestions = [];
        const incorrectQuestions = [];

        for (const answer of answers) {
            const question = quizTake.quiz.questions.find(q => q._id.toString() === answer.questionId);
            if (question) {
                const selectedOption = question.options.find(opt => opt._id.toString() === answer.answerOption);
                const correctOption = question.options.find(opt => opt.isCorrect);
                
                const questionDetail = {
                    question: question.content,
                    selectedAnswer: selectedOption ? selectedOption.content : 'No answer selected',
                    correctAnswer: correctOption ? correctOption.content : 'No correct answer defined'
                };

                if (selectedOption && selectedOption.isCorrect) {
                    correctAnswers++;
                    correctQuestions.push(questionDetail);
                } else {
                    incorrectQuestions.push(questionDetail);
                }
            }
        }

        // Prepare report data with detailed question information
        const reportData = {
            totalQuestions: quizTake.quiz.questions.length,
            answeredQuestions: answers.length,
            correctAnswers,
            incorrectAnswers: answers.length - correctAnswers,
            successRate: Math.round((correctAnswers / answers.length) * 100),
            timeSpentMinutes,
            correctQuestions,
            incorrectQuestions
        };

        // Generate AI report with detailed question analysis
        const aiReport = await aiService.generateQuizReport(reportData);

        // Create quiz report
        const quizReport = await QuizReport.create([{
            quizTake: quizTakeId,
            totalQuestions: reportData.totalQuestions,
            correctAnswers: reportData.correctAnswers,
            aiReport: aiReport.content,
            timeSpentMinutes: reportData.timeSpentMinutes
        }], { session });

        // Update quiz take status and add responses
        quizTake.status = 'completed';
        quizTake.completedAt = endTime;
        quizTake.responses = responses.map(r => r._id);
        await quizTake.save({ session });

        // Fetch complete quiz take with populated data
        const populatedQuizTake = await QuizTake.findById(quizTakeId)
            .populate({
                path: 'responses',
                populate: [
                    {
                        path: 'quizQuestion',
                        model: 'QuizQuestion',
                        populate: {
                            path: 'options',
                            model: 'QuizAnswerOption'
                        }
                    },
                    {
                        path: 'answerOption',
                        model: 'QuizAnswerOption'
                    }
                ]
            })
            .session(session);

        return {
            quizTake: populatedQuizTake,
            responses,
            report: quizReport[0] // Get first element since create returns an array
        };
    };

    try {
        // Execute with transaction
        const result = await transaction(submitQuizTransaction)(req, res, next);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
}); 