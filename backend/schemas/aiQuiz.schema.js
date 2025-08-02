const { z } = require('zod');

// Soru seçeneği schema'sı
const QuizAnswerOptionSchema = z.object({
  option: z.string().min(1, 'Seçenek metni gerekli'),
  isCorrect: z.boolean().default(false)
});

// Soru schema'sı
const QuizQuestionSchema = z.object({
  question: z.string().min(1, 'Soru metni gerekli'),
  type: z.enum(['multiple_choice', 'true_false', 'open_ended'], {
    errorMap: () => ({ message: 'Geçersiz soru türü' })
  }),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().min(1).max(10).default(1)
});

// Quiz verisi schema'sı
const QuizDataSchema = z.object({
  title: z.string().min(1, 'Quiz başlığı gerekli').max(100, 'Quiz başlığı çok uzun'),
  description: z.string().max(500, 'Açıklama çok uzun').optional(),
  classroomId: z.string().min(1, 'Sınıf ID gerekli'),
  timeLimit: z.number().min(1).max(180).default(30),
  passingScore: z.number().min(0).max(100).default(70),
  isActive: z.boolean().default(true)
});

// AI Quiz Extract Request Schema
const AIQuizExtractRequestSchema = z.object({
  quizData: QuizDataSchema,
  questions: z.array(QuizQuestionSchema).min(1, 'En az bir soru gerekli')
});

// AI Quiz Text Extract Request Schema
const AIQuizTextExtractRequestSchema = z.object({
  text: z.string().min(10, 'Metin çok kısa').max(10000, 'Metin çok uzun')
});

// AI Quiz Status Response Schema
const AIQuizStatusResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    gemini: z.boolean(),
    tesseract: z.boolean(),
    supportedFormats: z.object({
      images: z.array(z.string()),
      pdfs: z.array(z.string())
    })
  })
});

// AI Quiz Extract Response Schema
const AIQuizExtractResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    filename: z.string(),
    fileType: z.string(),
    totalQuestions: z.number(),
    questions: z.array(QuizQuestionSchema),
    extractedText: z.string()
  })
});

// AI Quiz Multiple Extract Response Schema
const AIQuizMultipleExtractResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    filename: z.string(),
    fileType: z.string(),
    totalQuestions: z.number(),
    questions: z.array(QuizQuestionSchema),
    extractedText: z.string(),
    success: z.boolean(),
    error: z.string().optional()
  }))
});

// AI Quiz Save Response Schema
const AIQuizSaveResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    teacherId: z.string(),
    classroomId: z.string(),
    timeLimit: z.number(),
    passingScore: z.number(),
    isActive: z.boolean(),
    questions: z.array(z.object({
      _id: z.string(),
      question: z.string(),
      type: z.string(),
      points: z.number(),
      explanation: z.string(),
      answerOptions: z.array(QuizAnswerOptionSchema).optional()
    }))
  })
});

module.exports = {
  QuizAnswerOptionSchema,
  QuizQuestionSchema,
  QuizDataSchema,
  AIQuizExtractRequestSchema,
  AIQuizTextExtractRequestSchema,
  AIQuizStatusResponseSchema,
  AIQuizExtractResponseSchema,
  AIQuizMultipleExtractResponseSchema,
  AIQuizSaveResponseSchema
}; 