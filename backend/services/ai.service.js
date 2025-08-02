const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const multer = require('multer');
const sharp = require('sharp');
const tesseract = require('node-tesseract-ocr');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

// Gemini konfigürasyonu
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  constructor() {
    this.supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
    this.supportedPdfFormats = ['pdf'];
  }

  /**
   * Dosya türünü kontrol eder
   * @param {string} filename - Dosya adı
   * @returns {string} - Dosya türü ('image', 'pdf', 'unsupported')
   */
  getFileType(filename) {
    const extension = path.extname(filename).toLowerCase().substring(1);
    
    if (this.supportedImageFormats.includes(extension)) {
      return 'image';
    } else if (this.supportedPdfFormats.includes(extension)) {
      return 'pdf';
    }
    
    return 'unsupported';
  }

  /**
   * PDF dosyasından metin çıkarır
   * @param {Buffer} fileBuffer - PDF dosya buffer'ı
   * @returns {Promise<string>} - Çıkarılan metin
   */
  async extractTextFromPDF(fileBuffer) {
    try {
      const data = await pdf(fileBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF metin çıkarma hatası: ${error.message}`);
    }
  }

  /**
   * Görsel dosyasından metin çıkarır (OCR)
   * @param {Buffer} fileBuffer - Görsel dosya buffer'ı
   * @returns {Promise<string>} - Çıkarılan metin
   */
  async extractTextFromImage(fileBuffer) {
    try {
      // Görseli optimize et
      const optimizedImage = await sharp(fileBuffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      // OCR konfigürasyonu
      const config = {
        lang: 'tur+eng', // Türkçe ve İngilizce
        oem: 1,
        psm: 3,
        dpi: 300,
        preprocess: 'contrast',
      };

      const text = await tesseract.recognize(optimizedImage, config);
      return text;
    } catch (error) {
      throw new Error(`Görsel metin çıkarma hatası: ${error.message}`);
    }
  }

  /**
   * AI ile metni analiz ederek soru-cevap çiftlerini çıkarır
   * @param {string} text - Analiz edilecek metin
   * @returns {Promise<Array>} - Soru-cevap çiftleri
   */
  async extractQuestionsAndAnswers(text) {
    try {
      // Zod schema for AI response validation
      const AIResponseSchema = z.object({
        questions: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()).optional(),
          correctAnswer: z.string().optional(),
          explanation: z.string().optional(),
          type: z.enum(['multiple_choice', 'true_false', 'open_ended'])
        }))
      });

      const prompt = `
Aşağıdaki metni analiz ederek soru ve cevapları çıkar. 
Metin bir sınav, quiz veya test içeriği olabilir.

Metin:
${text}

Lütfen aşağıdaki formatta JSON döndür:
{
  "questions": [
    {
      "question": "Soru metni",
      "options": ["A) Seçenek 1", "B) Seçenek 2", "C) Seçenek 3", "D) Seçenek 4"],
      "correctAnswer": "A",
      "explanation": "Doğru cevabın açıklaması (varsa)",
      "type": "multiple_choice" // multiple_choice, true_false, open_ended
    }
  ]
}

Eğer soru bulunamazsa boş array döndür. Sadece JSON formatında cevap ver.
`;

      // LangChain ile Gemini'ya prompt gönder
      const response = await model.invoke(prompt);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (e) {
        // Kod bloğu içinde dönerse ayıkla
        const match = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          parsedResponse = JSON.parse(match[1]);
        } else {
          throw new Error('AI yanıtı JSON formatında değil: ' + response);
        }
      }

      const validatedResponse = AIResponseSchema.parse(parsedResponse);
      return validatedResponse.questions || [];
    } catch (error) {
      throw new Error(`AI analiz hatası: ${error.message}`);
    }
  }

  /**
   * Dosyadan soru-cevap çiftlerini çıkarır
   * @param {Buffer} fileBuffer - Dosya buffer'ı
   * @param {string} filename - Dosya adı
   * @returns {Promise<Array>} - Soru-cevap çiftleri
   */
  async extractQuestionsFromFile(fileBuffer, filename) {
    try {
      const fileType = this.getFileType(filename);
      
      if (fileType === 'unsupported') {
        throw new Error('Desteklenmeyen dosya formatı');
      }

      let extractedText = '';

      if (fileType === 'pdf') {
        extractedText = await this.extractTextFromPDF(fileBuffer);
      } else if (fileType === 'image') {
        extractedText = await this.extractTextFromImage(fileBuffer);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Dosyadan metin çıkarılamadı');
      }

      // AI ile soru-cevap analizi
      const questions = await this.extractQuestionsAndAnswers(extractedText);
      
      return {
        success: true,
        questions: questions,
        extractedText: extractedText.substring(0, 500) + '...', // İlk 500 karakter
        fileType: fileType,
        totalQuestions: questions.length
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        questions: [],
        extractedText: '',
        fileType: this.getFileType(filename),
        totalQuestions: 0
      };
    }
  }

  /**
   * Çoklu dosyadan soru-cevap çiftlerini çıkarır
   * @param {Array} files - Dosya array'i
   * @returns {Promise<Array>} - Her dosya için sonuçlar
   */
  async extractQuestionsFromMultipleFiles(files) {
    const results = [];
    
    for (const file of files) {
      const result = await this.extractQuestionsFromFile(file.buffer, file.originalname);
      results.push({
        filename: file.originalname,
        ...result
      });
    }
    
    return results;
  }

  /**
   * Soru formatını doğrular
   * @param {Object} question - Soru objesi
   * @returns {boolean} - Geçerli mi
   */
  validateQuestion(question) {
    return (
      question.question &&
      question.question.trim().length > 0 &&
      question.type &&
      ['multiple_choice', 'true_false', 'open_ended'].includes(question.type)
    );
  }

  /**
   * Çıkarılan soruları temizler ve formatlar
   * @param {Array} questions - Ham sorular
   * @returns {Array} - Temizlenmiş sorular
   */
  cleanAndFormatQuestions(questions) {
    return questions
      .filter(question => this.validateQuestion(question))
      .map(question => ({
        ...question,
        question: question.question.trim(),
        options: question.options ? question.options.map(opt => opt.trim()) : [],
        correctAnswer: question.correctAnswer ? question.correctAnswer.trim() : '',
        explanation: question.explanation ? question.explanation.trim() : ''
      }));
  }
}

module.exports = new AIService();
