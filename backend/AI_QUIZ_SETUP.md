# AI Quiz Sistemi Kurulum Rehberi

Bu rehber, PDF ve görsel dosyalarından otomatik olarak soru çıkaran AI quiz sisteminin kurulumunu açıklar.

## Gereksinimler

### 1. Node.js Paketleri

Aşağıdaki paketleri yükleyin:

```bash
npm install multer pdf-parse sharp node-tesseract-ocr openai
```

### 2. Sistem Gereksinimleri

#### Tesseract OCR Kurulumu

**Windows:**
```bash
# Chocolatey ile
choco install tesseract

# veya manuel olarak https://github.com/UB-Mannheim/tesseract/wiki adresinden indirin
```

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-tur  # Türkçe dil desteği
```

**CentOS/RHEL:**
```bash
sudo yum install tesseract
sudo yum install tesseract-langpack-tur  # Türkçe dil desteği
```

### 3. Çevre Değişkenleri

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Diğer gerekli değişkenler...
```

## API Endpoints

### 1. AI Servis Durumu Kontrolü
```
GET /api/v1/quiz/ai/status
```

### 2. Tek Dosyadan Soru Çıkarma
```
POST /api/v1/quiz/ai/extract
Content-Type: multipart/form-data
Body: file (PDF veya görsel dosya)
```

### 3. Çoklu Dosyadan Soru Çıkarma
```
POST /api/v1/quiz/ai/extract-multiple
Content-Type: multipart/form-data
Body: files[] (PDF veya görsel dosyalar)
```

### 4. Metin Girişinden Soru Çıkarma
```
POST /api/v1/quiz/ai/extract-from-text
Content-Type: application/json
Body: { "text": "soru içeren metin" }
```

### 5. Çıkarılan Soruları Quiz Olarak Kaydetme
```
POST /api/v1/quiz/ai/save-quiz
Content-Type: application/json
Body: {
  "quizData": {
    "title": "Quiz Başlığı",
    "description": "Açıklama",
    "classroomId": "sınıf_id",
    "timeLimit": 30,
    "passingScore": 70,
    "isActive": true
  },
  "questions": [
    {
      "question": "Soru metni",
      "type": "multiple_choice",
      "options": ["A) Seçenek 1", "B) Seçenek 2"],
      "correctAnswer": "A",
      "explanation": "Açıklama"
    }
  ]
}
```

## Desteklenen Dosya Formatları

### Görsel Dosyalar
- JPG/JPEG
- PNG
- GIF
- BMP
- TIFF

### PDF Dosyaları
- PDF (tek sayfa veya çok sayfa)

## Özellikler

### 1. OCR (Optical Character Recognition)
- Görsel dosyalardan metin çıkarma
- Türkçe ve İngilizce dil desteği
- Otomatik görsel optimizasyonu

### 2. PDF İşleme
- PDF dosyalarından metin çıkarma
- Çok sayfa desteği

### 3. AI Analizi
- OpenAI GPT-4 kullanarak soru-cevap çıkarma
- Çoktan seçmeli, doğru/yanlış, açık uçlu soru türleri
- Otomatik doğru cevap tespiti

### 4. Zod Validasyonu
- Request/response validasyonu
- Tip güvenliği
- Hata mesajları

## Kullanım Örnekleri

### Frontend Kullanımı

```javascript
// Dosya yükleme
const formData = new FormData();
formData.append('file', file);

const response = await axios.post('/api/v1/quiz/ai/extract', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Metin girişi
const response = await axios.post('/api/v1/quiz/ai/extract-from-text', {
  text: 'Soru içeren metin...'
});

// Quiz kaydetme
const response = await axios.post('/api/v1/quiz/ai/save-quiz', {
  quizData: {
    title: 'Test Quiz',
    classroomId: 'classroom_id'
  },
  questions: extractedQuestions
});
```

### Backend Kullanımı

```javascript
const AIService = require('./services/ai.service');

// Dosyadan soru çıkarma
const result = await AIService.extractQuestionsFromFile(fileBuffer, filename);

// Metin analizi
const questions = await AIService.extractQuestionsAndAnswers(text);
```

## Hata Yönetimi

Sistem aşağıdaki hata durumlarını yönetir:

- Desteklenmeyen dosya formatı
- OCR işleme hatası
- PDF okuma hatası
- AI API hatası
- Validasyon hataları

## Performans Optimizasyonları

1. **Görsel Optimizasyonu**: Sharp kütüphanesi ile görseller otomatik olarak optimize edilir
2. **Dosya Boyutu Limiti**: 10MB maksimum dosya boyutu
3. **Batch İşleme**: Çoklu dosya desteği
4. **Memory Management**: Dosyalar memory'de işlenir, disk kullanılmaz

## Güvenlik

- Sadece teacher rolündeki kullanıcılar erişebilir
- Dosya türü validasyonu
- Dosya boyutu sınırlaması
- Zod ile input validasyonu

## Sorun Giderme

### Tesseract Kurulum Sorunları

1. Tesseract'ın PATH'te olduğundan emin olun
2. Dil paketlerinin kurulu olduğunu kontrol edin
3. Test komutu: `tesseract --version`

### OpenAI API Sorunları

1. API key'in doğru olduğunu kontrol edin
2. API limitlerini kontrol edin
3. Network bağlantısını kontrol edin

### Dosya İşleme Sorunları

1. Dosya formatının desteklendiğini kontrol edin
2. Dosya boyutunun limit altında olduğunu kontrol edin
3. Dosyanın bozuk olmadığını kontrol edin

## Geliştirme Notları

- Sistem modüler yapıda tasarlanmıştır
- Yeni dosya formatları kolayca eklenebilir
- AI prompt'ları özelleştirilebilir
- Validasyon kuralları Zod schema'ları ile yönetilir 