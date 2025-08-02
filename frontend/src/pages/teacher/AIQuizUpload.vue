<template>
  <div class="ai-quiz-upload">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-robot me-2"></i>
                AI Quiz Oluşturucu (Gemini)
              </h3>
              <p class="card-subtitle text-muted">
                PDF veya görsel dosyalarından otomatik olarak soru çıkarın
              </p>
            </div>
            
            <div class="card-body">
              <!-- AI Status Check -->
              <div v-if="aiStatus" class="alert alert-info">
                <div class="d-flex align-items-center">
                  <i class="fas fa-info-circle me-2"></i>
                  <div>
                    <strong>AI Servis Durumu:</strong>
                    <span v-if="aiStatus.gemini" class="text-success ms-2">
                      <i class="fas fa-check"></i> Gemini Aktif
                    </span>
                    <span v-else class="text-danger ms-2">
                      <i class="fas fa-times"></i> Gemini Pasif
                    </span>
                    <span v-if="aiStatus.tesseract" class="text-success ms-2">
                      <i class="fas fa-check"></i> OCR Aktif
                    </span>
                  </div>
                </div>
              </div>

              <!-- Upload Tabs -->
              <ul class="nav nav-tabs" id="uploadTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link active" 
                    id="file-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#file-upload" 
                    type="button" 
                    role="tab"
                  >
                    <i class="fas fa-file-upload me-2"></i>
                    Dosya Yükle
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="text-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#text-input" 
                    type="button" 
                    role="tab"
                  >
                    <i class="fas fa-keyboard me-2"></i>
                    Metin Girişi
                  </button>
                </li>
              </ul>

              <div class="tab-content mt-3" id="uploadTabsContent">
                <!-- File Upload Tab -->
                <div class="tab-pane fade show active" id="file-upload" role="tabpanel">
                  <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
                    <div class="upload-content">
                      <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                      <h5>Dosya Yükle</h5>
                      <p class="text-muted">
                        PDF veya görsel dosyalarını buraya sürükleyin veya seçin
                      </p>
                      <div class="supported-formats">
                        <small class="text-muted">
                          Desteklenen formatlar: PDF, JPG, PNG, GIF, BMP, TIFF
                        </small>
                      </div>
                      <input 
                        ref="fileInput" 
                        type="file" 
                        multiple 
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                        @change="handleFileSelect"
                        class="d-none"
                      >
                      <button 
                        @click="$refs.fileInput.click()" 
                        class="btn btn-primary mt-3"
                        :disabled="isProcessing"
                      >
                        <i class="fas fa-folder-open me-2"></i>
                        Dosya Seç
                      </button>
                    </div>
                  </div>

                  <!-- Selected Files -->
                  <div v-if="selectedFiles.length > 0" class="selected-files mt-4">
                    <h6>Seçilen Dosyalar:</h6>
                    <div class="row">
                      <div 
                        v-for="(file, index) in selectedFiles" 
                        :key="index"
                        class="col-md-6 col-lg-4 mb-3"
                      >
                        <div class="file-card">
                          <div class="file-icon">
                            <i v-if="file.type === 'pdf'" class="fas fa-file-pdf text-danger"></i>
                            <i v-else class="fas fa-file-image text-success"></i>
                          </div>
                          <div class="file-info">
                            <div class="file-name">{{ file.name }}</div>
                            <div class="file-size">{{ formatFileSize(file.size) }}</div>
                          </div>
                          <button 
                            @click="removeFile(index)" 
                            class="btn btn-sm btn-outline-danger"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-3">
                      <button 
                        @click="processFiles" 
                        class="btn btn-success"
                        :disabled="isProcessing"
                      >
                        <i v-if="isProcessing" class="fas fa-spinner fa-spin me-2"></i>
                        <i v-else class="fas fa-magic me-2"></i>
                        {{ isProcessing ? 'İşleniyor...' : 'Soruları Çıkar' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Text Input Tab -->
                <div class="tab-pane fade" id="text-input" role="tabpanel">
                  <div class="form-group">
                    <label for="textInput" class="form-label">Metin İçeriği</label>
                    <textarea 
                      id="textInput"
                      v-model="textInput"
                      class="form-control" 
                      rows="10"
                      placeholder="Soru ve cevapları içeren metni buraya yapıştırın..."
                    ></textarea>
                    <div class="form-text">
                      Metin en az 10 karakter olmalıdır. Maksimum 10,000 karakter.
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <button 
                      @click="processText" 
                      class="btn btn-success"
                      :disabled="isProcessing || !textInput.trim()"
                    >
                      <i v-if="isProcessing" class="fas fa-spinner fa-spin me-2"></i>
                      <i v-else class="fas fa-magic me-2"></i>
                      {{ isProcessing ? 'İşleniyor...' : 'Soruları Çıkar' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Results Section -->
              <div v-if="extractedQuestions.length > 0" class="results-section mt-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">
                      <i class="fas fa-list-check me-2"></i>
                      Çıkarılan Sorular ({{ extractedQuestions.length }})
                    </h5>
                  </div>
                  
                  <div class="card-body">
                    <div v-for="(question, index) in extractedQuestions" :key="index" class="question-item mb-4">
                      <div class="question-header">
                        <span class="question-number">Soru {{ index + 1 }}</span>
                        <span class="question-type badge bg-primary">{{ getQuestionTypeLabel(question.type) }}</span>
                      </div>
                      
                      <div class="question-content">
                        <p class="question-text">{{ question.question }}</p>
                        
                        <div v-if="question.options && question.options.length > 0" class="options-list">
                          <div 
                            v-for="(option, optIndex) in question.options" 
                            :key="optIndex"
                            class="option-item"
                            :class="{ 'correct': isCorrectOption(option, question.correctAnswer) }"
                          >
                            <span class="option-letter">{{ option.charAt(0) }}</span>
                            <span class="option-text">{{ option.substring(2) }}</span>
                            <i v-if="isCorrectOption(option, question.correctAnswer)" class="fas fa-check text-success"></i>
                          </div>
                        </div>
                        
                        <div v-if="question.explanation" class="explanation mt-2">
                          <small class="text-muted">
                            <strong>Açıklama:</strong> {{ question.explanation }}
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    <div class="actions mt-4">
                      <button @click="saveAsQuiz" class="btn btn-primary me-2">
                        <i class="fas fa-save me-2"></i>
                        Quiz Olarak Kaydet
                      </button>
                      <button @click="clearResults" class="btn btn-outline-secondary">
                        <i class="fas fa-trash me-2"></i>
                        Temizle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Messages -->
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Quiz Modal -->
    <div class="modal fade" id="saveQuizModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Quiz Kaydet</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="confirmSaveQuiz">
              <div class="mb-3">
                <label for="quizTitle" class="form-label">Quiz Başlığı</label>
                <input 
                  id="quizTitle"
                  v-model="quizForm.title"
                  type="text" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="quizDescription" class="form-label">Açıklama</label>
                <textarea 
                  id="quizDescription"
                  v-model="quizForm.description"
                  class="form-control" 
                  rows="3"
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label for="classroomSelect" class="form-label">Sınıf</label>
                <select 
                  id="classroomSelect"
                  v-model="quizForm.classroomId"
                  class="form-select" 
                  required
                >
                  <option value="">Sınıf seçin</option>
                  <option v-for="classroom in classrooms" :key="classroom._id" :value="classroom._id">
                    {{ classroom.name }}
                  </option>
                </select>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="timeLimit" class="form-label">Süre (dakika)</label>
                    <input 
                      id="timeLimit"
                      v-model.number="quizForm.timeLimit"
                      type="number" 
                      class="form-control" 
                      min="1" 
                      max="180"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="passingScore" class="form-label">Geçme Notu (%)</label>
                    <input 
                      id="passingScore"
                      v-model.number="quizForm.passingScore"
                      type="number" 
                      class="form-control" 
                      min="0" 
                      max="100"
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
            <button @click="confirmSaveQuiz" class="btn btn-primary" :disabled="isSaving">
              <i v-if="isSaving" class="fas fa-spinner fa-spin me-2"></i>
              {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AIQuizUpload',
  setup() {
    const fileInput = ref(null);
    const selectedFiles = ref([]);
    const textInput = ref('');
    const extractedQuestions = ref([]);
    const isProcessing = ref(false);
    const isSaving = ref(false);
    const errorMessage = ref('');
    const aiStatus = ref(null);
    const classrooms = ref([]);
    
    const quizForm = reactive({
      title: '',
      description: '',
      classroomId: '',
      timeLimit: 30,
      passingScore: 70,
      isActive: true
    });

    // AI servis durumunu kontrol et
    const checkAIStatus = async () => {
      try {
        const response = await axios.get('/api/v1/quiz/ai/status');
        aiStatus.value = response.data.data;
      } catch (error) {
        console.error('AI status check failed:', error);
      }
    };

    // Sınıfları getir
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('/api/v1/classrooms');
        classrooms.value = response.data.data;
      } catch (error) {
        console.error('Classrooms fetch failed:', error);
      }
    };

    // Dosya seçimi
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files);
      addFiles(files);
    };

    // Drag & drop
    const handleDrop = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      addFiles(files);
    };

    // Dosya ekleme
    const addFiles = (files) => {
      const validFiles = files.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
        return validTypes.includes(file.type);
      });

      selectedFiles.value.push(...validFiles);
    };

    // Dosya kaldırma
    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1);
    };

    // Dosya boyutunu formatla
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Dosyaları işle
    const processFiles = async () => {
      if (selectedFiles.value.length === 0) return;

      isProcessing.value = true;
      errorMessage.value = '';

      try {
        const formData = new FormData();
        selectedFiles.value.forEach(file => {
          formData.append('files', file);
        });

        const response = await axios.post('/api/v1/quiz/ai/extract-multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Tüm dosyalardan çıkarılan soruları birleştir
        const allQuestions = [];
        response.data.data.forEach(result => {
          if (result.success && result.questions) {
            allQuestions.push(...result.questions);
          }
        });

        extractedQuestions.value = allQuestions;
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Dosya işleme hatası';
      } finally {
        isProcessing.value = false;
      }
    };

    // Metin işle
    const processText = async () => {
      if (!textInput.value.trim()) return;

      isProcessing.value = true;
      errorMessage.value = '';

      try {
        const response = await axios.post('/api/v1/quiz/ai/extract-from-text', {
          text: textInput.value
        });

        extractedQuestions.value = response.data.data.questions;
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Metin işleme hatası';
      } finally {
        isProcessing.value = false;
      }
    };

    // Soru türü etiketi
    const getQuestionTypeLabel = (type) => {
      const labels = {
        multiple_choice: 'Çoktan Seçmeli',
        true_false: 'Doğru/Yanlış',
        open_ended: 'Açık Uçlu'
      };
      return labels[type] || type;
    };

    // Doğru seçenek kontrolü
    const isCorrectOption = (option, correctAnswer) => {
      return option.charAt(0) === correctAnswer;
    };

    // Quiz olarak kaydet
    const saveAsQuiz = () => {
      if (extractedQuestions.value.length === 0) return;
      
      // Modal'ı aç
      const modal = new bootstrap.Modal(document.getElementById('saveQuizModal'));
      modal.show();
    };

    // Quiz kaydetmeyi onayla
    const confirmSaveQuiz = async () => {
      if (!quizForm.title || !quizForm.classroomId) return;

      isSaving.value = true;

      try {
        const response = await axios.post('/api/v1/quiz/ai/save-quiz', {
          quizData: quizForm,
          questions: extractedQuestions.value
        });

        // Başarılı kayıt
        const modal = bootstrap.Modal.getInstance(document.getElementById('saveQuizModal'));
        modal.hide();
        
        // Quiz sayfasına yönlendir
        this.$router.push(`/teacher/quiz/${response.data.data._id}`);
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Quiz kaydetme hatası';
      } finally {
        isSaving.value = false;
      }
    };

    // Sonuçları temizle
    const clearResults = () => {
      extractedQuestions.value = [];
      selectedFiles.value = [];
      textInput.value = '';
      errorMessage.value = '';
    };

    onMounted(() => {
      checkAIStatus();
      fetchClassrooms();
    });

    return {
      fileInput,
      selectedFiles,
      textInput,
      extractedQuestions,
      isProcessing,
      isSaving,
      errorMessage,
      aiStatus,
      classrooms,
      quizForm,
      handleFileSelect,
      handleDrop,
      removeFile,
      formatFileSize,
      processFiles,
      processText,
      getQuestionTypeLabel,
      isCorrectOption,
      saveAsQuiz,
      confirmSaveQuiz,
      clearResults
    };
  }
};
</script>

<style scoped>
.ai-quiz-upload {
  padding: 2rem 0;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.upload-area.dragover {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.file-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #fff;
}

.file-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.875rem;
  color: #6c757d;
}

.question-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fff;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-number {
  font-weight: 600;
  color: #495057;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.options-list {
  margin-bottom: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
}

.option-item.correct {
  border-color: #28a745;
  background-color: #d4edda;
}

.option-letter {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 20px;
}

.option-text {
  flex: 1;
}

.explanation {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.actions {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}
</style> 