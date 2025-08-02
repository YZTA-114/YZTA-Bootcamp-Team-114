const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../../middleware/auth');

// AI Quiz Controller
const {
  extractQuestionsFromFile,
  extractQuestionsFromMultipleFiles,
  saveExtractedQuestionsAsQuiz,
  extractQuestionsFromText,
  getAIStatus
} = require('../../controllers/quiz/aiQuizController');

// Multer konfigürasyonu - dosyaları memory'de tut
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Desteklenen dosya türlerini kontrol et
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya türü'), false);
    }
  }
});

router.use(protect);

// @route   GET /api/v1/quiz/ai/status
// @desc    AI servis durumunu kontrol et
router.get('/status', getAIStatus);

// @route   POST /api/v1/quiz/ai/extract
// @desc    Tek dosyadan soru çıkar
router.post('/extract', upload.single('file'), extractQuestionsFromFile);

// @route   POST /api/v1/quiz/ai/extract-multiple
// @desc    Çoklu dosyadan soru çıkar
router.post('/extract-multiple', upload.array('files', 5), extractQuestionsFromMultipleFiles);

// @route   POST /api/v1/quiz/ai/extract-from-text
// @desc    Metin girişinden soru çıkar
router.post('/extract-from-text', extractQuestionsFromText);

// @route   POST /api/v1/quiz/ai/save-quiz
// @desc    Çıkarılan soruları quiz olarak kaydet
router.post('/save-quiz', saveExtractedQuestionsAsQuiz);

module.exports = router; 