const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const multer = require('multer');
const sharp = require('sharp');
const tesseract = require('node-tesseract-ocr');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputFunctionsParser } = require("langchain/output_parsers");
const { z } = require('zod');

// Add logger utility
const logger = {
  info: (message, data = '') => console.log(`[INFO] ${message}`, data),
  error: (message, error = '') => console.error(`[ERROR] ${message}`, error),
  debug: (message, data = '') => console.debug(`[DEBUG] ${message}`, data)
};

class AIService {
  constructor() {
    this.supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
    this.supportedPdfFormats = ['pdf'];

    // Initialize Gemini model
    this.model = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Define the output parser schema
    this.questionsJsonSchema = {
      name: "ExtractQuestions",
      description: "Extract questions and answers from text",
      parameters: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { 
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      isCorrect: { type: "boolean" },
                      content: { type: "string" },
                      explanation: { type: "string" }
                    },
                    required: ["isCorrect", "content"]
                  }
                },
                type: { 
                  type: "string",
                  enum: ["multiple_choice", "true_false", "open_ended"]
                }
              },
              required: ["question", "type"]
            }
          }
        },
        required: ["questions"]
      }
    };

    // Create output parser
    this.outputParser = new JsonOutputFunctionsParser({
      function_schema: this.questionsJsonSchema
    });

    // Create prompt template
    this.promptTemplate = new PromptTemplate({
      template: `Analyze the following text and extract questions and answers. The text may be from an exam, quiz, or test content.
    
    Text:
    {text}
    
    Extract questions and answers in a JSON format with the following structure:
    - A "questions" array containing question objects
    - Each question object should have:
      - "question": the question text
      - "options": array of option objects (each with "isCorrect", "content", and optional "explanation")
      - "type": either "multiple_choice", "true_false", or "open_ended"
    
    Example format:
    {{
      "questions": [
        {{
          "question": "What is the capital of France?",
          "options": [
            {{
              "isCorrect": true,
              "content": "Paris",
              "explanation": "Paris is the capital and largest city of France"
            }},
            {{
              "isCorrect": false,
              "content": "London"
            }}
          ],
          "type": "multiple_choice"
        }}
      ]
    }}
    
    IMPORTANT RULES:
    1. Return ONLY the JSON object, no other text
    2. DO NOT wrap the response in markdown code blocks (no \`\`\`)
    3. DO NOT add 'json' or any other text at the beginning
    4. DO NOT add any comments or explanations
    5. The response must be valid JSON

    If no questions are found, return an empty array: {{"questions": []}}`,
      inputVariables: ["text"]
    });

    // Initialize Zod schema for response validation
    this.AIResponseSchema = z.object({
      questions: z.array(z.object({
        question: z.string(),
        options: z.array(
          z.object({
            isCorrect: z.boolean(),
            content: z.string(),
            explanation: z.string().optional()
          })
        ).optional(),
        type: z.enum(['multiple_choice', 'true_false', 'open_ended'])
      }))
    });
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
      logger.info('Starting PDF text extraction');
      const data = await pdf(fileBuffer);
      logger.info('PDF text extraction completed', { textLength: data.text.length });
      return data.text;
    } catch (error) {
      logger.error('PDF text extraction failed', error);
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
      logger.info('Starting image text extraction');
      
      logger.debug('Optimizing image');
      const optimizedImage = await sharp(fileBuffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();
      logger.debug('Image optimization completed');

      const config = {
        lang: 'tur+eng',
        oem: 3,
        psm: 3,
        dpi: 300,
      };

      logger.debug('Starting OCR processing');
      const text = await tesseract.recognize(optimizedImage, config);
      logger.info('Image text extraction completed', { textLength: text.length });
      return text;
    } catch (error) {
      logger.error('Image text extraction failed', error);
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
      logger.info('Starting AI analysis');
      
      logger.debug('Formatting prompt');
      const formattedPrompt = await this.promptTemplate.format({ text });

      logger.debug('Calling AI model');
      const response = await this.model.invoke(formattedPrompt);
      
      logger.debug('Response received', { responseType: typeof response });
      
      // Handle different response formats
      let responseText;
      if (typeof response === 'string') {
        responseText = response;
      } else if (response && response.content) {
        responseText = response.content;
      } else if (Array.isArray(response) && response.length > 0) {
        responseText = response[0].content;
      } else {
        throw new Error('Unexpected response format from AI model');
      }

      // Clean the response text
      responseText = responseText
        // Remove markdown code blocks
        .replace(/```(?:json)?\n?/g, '')
        // Remove any trailing/leading whitespace
        .trim();
      
      logger.debug('Cleaned response text', { 
        firstChars: responseText.substring(0, 50) + '...',
        length: responseText.length 
      });

      logger.debug('Parsing AI response');
      let parsedResponse;
      try {
        parsedResponse = await this.outputParser.parse(responseText);
      } catch (parseError) {
        logger.error('Failed to parse AI response', { 
          error: parseError.message,
          responseText: responseText.substring(0, 200) + '...' 
        });
        throw new Error(`JSON parsing error: ${parseError.message}`);
      }

      logger.debug('Validating response schema');
      let validatedResponse;
      try {
        validatedResponse = this.AIResponseSchema.parse(parsedResponse);
      } catch (validationError) {
        logger.error('Schema validation failed', { 
          error: validationError.message,
          parsedResponse 
        });
        throw new Error(`Schema validation error: ${validationError.message}`);
      }
      
      const questions = validatedResponse.questions || [];
      logger.info('AI analysis completed', { questionCount: questions.length });
      
      // Additional validation of questions
      if (questions.length > 0) {
        logger.debug('Sample question', { 
          firstQuestion: {
            type: questions[0].type,
            hasOptions: Boolean(questions[0].options),
            optionsCount: questions[0].options?.length
          }
        });
      }
      
      return questions;
    } catch (error) {
      logger.error('AI analysis failed', {
        errorType: error.constructor.name,
        errorMessage: error.message,
        stack: error.stack
      });
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
      logger.info('Starting file processing', { filename });
      const fileType = this.getFileType(filename);
      
      if (fileType === 'unsupported') {
        logger.error('Unsupported file type', { filename, fileType });
        throw new Error('Desteklenmeyen dosya formatı');
      }

      logger.debug('File type detected', { fileType });
      let extractedText = '';

      if (fileType === 'pdf') {
        extractedText = await this.extractTextFromPDF(fileBuffer);
      } else if (fileType === 'image') {
        extractedText = await this.extractTextFromImage(fileBuffer);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        logger.error('No text extracted from file', { filename });
        throw new Error('Dosyadan metin çıkarılamadı');
      }

      logger.debug('Text extracted successfully', { textLength: extractedText.length });
      const questions = await this.extractQuestionsAndAnswers(extractedText);
      
      const result = {
        success: true,
        questions: questions,
        extractedText: extractedText.substring(0, 500) + '...',
        fileType: fileType,
        totalQuestions: questions.length
      };
      
      logger.info('File processing completed', { 
        filename,
        fileType,
        totalQuestions: questions.length 
      });
      
      return result;
    } catch (error) {
      logger.error('File processing failed', { 
        filename,
        error: error.message 
      });
      
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
    logger.info('Starting multiple files processing', { fileCount: files.length });
    const results = [];
    
    for (const file of files) {
      logger.debug('Processing file', { filename: file.originalname });
      const result = await this.extractQuestionsFromFile(file.buffer, file.originalname);
      results.push({
        filename: file.originalname,
        ...result
      });
    }
    
    logger.info('Multiple files processing completed', { 
      totalFiles: files.length,
      successCount: results.filter(r => r.success).length
    });
    
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
    try {
      logger.debug('Starting to clean and format questions', { questionCount: questions.length });
      
      return questions
        .filter(question => this.validateQuestion(question))
        .map(question => {
          const cleanedQuestion = {
            ...question,
            question: question.question?.trim() || '',
            type: question.type?.trim() || 'multiple_choice'
          };

          // Handle options if they exist
          if (Array.isArray(question.options)) {
            cleanedQuestion.options = question.options.map(opt => {
              if (typeof opt === 'string') {
                return {
                  content: opt.trim(),
                  isCorrect: false
                };
              }
              return {
                content: (opt.content || '').trim(),
                isCorrect: Boolean(opt.isCorrect),
                explanation: opt.explanation ? opt.explanation.trim() : undefined
              };
            });
          } else {
            cleanedQuestion.options = [];
          }

          // Handle optional fields
          if (question.explanation) {
            cleanedQuestion.explanation = question.explanation.trim();
          }

          return cleanedQuestion;
        });
    } catch (error) {
      logger.error('Error in cleanAndFormatQuestions', {
        error: error.message,
        stack: error.stack
      });
      // Return the original questions if cleaning fails
      return questions;
    }
  }
}

module.exports = new AIService();
