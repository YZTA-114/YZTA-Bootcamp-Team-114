const AIService = require('../../services/ai.service');
const Quiz = require('../../models/quiz/Quiz');
const QuizQuestion = require('../../models/quiz/QuizQuestion');
const QuizAnswerOption = require('../../models/quiz/QuizAnswerOption');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const { 
  AIQuizExtractRequestSchema, 
  AIQuizTextExtractRequestSchema,
  AIQuizStatusResponseSchema,
  AIQuizExtractResponseSchema,
  AIQuizMultipleExtractResponseSchema,
  AIQuizSaveResponseSchema
} = require('../../schemas/aiQuiz.schema');

// @desc    PDF/Görsel dosyasından soru çıkar
// @route   POST /api/v1/quiz/ai/extract
// @access  Private (Teacher)
exports.extractQuestionsFromFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Dosya yüklenmedi', 400));
  }

  const result = await AIService.extractQuestionsFromFile(
    req.file.buffer,
    req.file.originalname
  );

  if (!result.success) {
    return next(new ErrorResponse(result.error, 400));
  }

  // Soruları temizle ve formatla
  const cleanedQuestions = AIService.cleanAndFormatQuestions(result.questions);

  res.status(200).json({
    success: true,
    data: {
      filename: req.file.originalname,
      fileType: result.fileType,
      totalQuestions: cleanedQuestions.length,
      questions: cleanedQuestions,
      extractedText: result.extractedText
    }
  });
});

// @desc    Çoklu dosyadan soru çıkar
// @route   POST /api/v1/quiz/ai/extract-multiple
// @access  Private (Teacher)
exports.extractQuestionsFromMultipleFiles = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Dosya yüklenmedi', 400));
  }

  const results = await AIService.extractQuestionsFromMultipleFiles(req.files);

  // Her dosya için soruları temizle
  const processedResults = results.map(result => ({
    ...result,
    questions: AIService.cleanAndFormatQuestions(result.questions)
  }));

  res.status(200).json({
    success: true,
    data: processedResults
  });
});

// @desc    Çıkarılan soruları quiz olarak kaydet
// @route   POST /api/v1/quiz/ai/save-quiz
// @access  Private (Teacher)
exports.saveExtractedQuestionsAsQuiz = asyncHandler(async (req, res, next) => {
  try {
    // Zod ile request body'yi validate et
    const validatedData = AIQuizExtractRequestSchema.parse(req.body);
    const { quizData, questions } = validatedData;

  // Quiz oluştur
  const quiz = await Quiz.create({
    title: quizData.title,
    description: quizData.description || 'AI ile oluşturulan quiz',
    teacherId: req.user.id,
    classroomId: quizData.classroomId,
    timeLimit: quizData.timeLimit || 30,
    passingScore: quizData.passingScore || 70,
    isActive: quizData.isActive !== undefined ? quizData.isActive : true
  });

  // Soruları kaydet
  for (const questionData of questions) {
    const question = await QuizQuestion.create({
      quizId: quiz.id,
      question: questionData.question,
      type: questionData.type,
      points: questionData.points || 1,
      explanation: questionData.explanation || ''
    });

    // Çoktan seçmeli sorular için seçenekleri kaydet
    if (questionData.type === 'multiple_choice' && questionData.options) {
      for (let i = 0; i < questionData.options.length; i++) {
        const option = questionData.options[i];
        const isCorrect = questionData.correctAnswer === option.charAt(0);
        
        await QuizAnswerOption.create({
          questionId: question.id,
          option: option,
          isCorrect: isCorrect
        });
      }
    }
  }

  // Quiz'i sorularla birlikte getir
  const savedQuiz = await Quiz.findById(quiz.id)
    .populate({
      path: 'questions',
      populate: {
        path: 'answerOptions'
      }
    });

  // Response'u Zod ile validate et
  const validatedResponse = AIQuizSaveResponseSchema.parse({
    success: true,
    data: savedQuiz
  });

  res.status(201).json(validatedResponse);
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new ErrorResponse('Geçersiz veri formatı', 400));
    }
    next(error);
  }
});

// @desc    Metin girişinden soru çıkar
// @route   POST /api/v1/quiz/ai/extract-from-text
// @access  Private (Teacher)
exports.extractQuestionsFromText = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return next(new ErrorResponse('Metin gerekli', 400));
  }

  try {
    const questions = await AIService.extractQuestionsAndAnswers(text);
    const cleanedQuestions = AIService.cleanAndFormatQuestions(questions);

    res.status(200).json({
      success: true,
      data: {
        totalQuestions: cleanedQuestions.length,
        questions: cleanedQuestions
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Soru çıkarma hatası: ${error.message}`, 500));
  }
});

// @desc    Dosya yükleme durumunu kontrol et
// @route   GET /api/v1/quiz/ai/status
// @access  Private
exports.getAIStatus = asyncHandler(async (req, res, next) => {
  const status = {
    gemini: !!process.env.GEMINI_API_KEY,
    tesseract: true, // Tesseract kurulu olmalı
    supportedFormats: {
      images: AIService.supportedImageFormats,
      pdfs: AIService.supportedPdfFormats
    }
  };

  res.status(200).json({
    success: true,
    data: status
  });
});