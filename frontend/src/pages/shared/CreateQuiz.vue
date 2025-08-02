<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #breadcrumb>
      <span>Quiz Oluştur</span>
    </template>
    <template #sidebar-classroom-dropdown>
      <div class="sidebar-classroom-dropdown modern-dropdown">
        <div class="dropdown-selected" @click="dropdownOpen = !dropdownOpen">
          <span class="dropdown-selected-title">{{ selectedClassroom.name }}</span>
          <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
        </div>
        <div v-if="dropdownOpen" class="dropdown-list">
          <div class="dropdown-header">Sınıflar</div>
          <div class="dropdown-search-wrapper">
            <input type="text" v-model="classroomSearch" placeholder="Sınıf ara..." class="dropdown-search" />
          </div>
          <div class="dropdown-items">
            <div
              v-for="classroom in filteredClassrooms"
              :key="classroom.id"
              class="dropdown-item"
              :class="{ selected: classroom.id === selectedClassroom.id }"
              @click="selectClassroom(classroom)"
            >
              {{ classroom.name }}
            </div>
            <div v-if="filteredClassrooms.length === 0" class="dropdown-empty">Sonuç bulunamadı</div>
          </div>
          <div class="dropdown-footer">
            <button class="join-class-btn" @click="joinNewClass">
              <ri-add-line />
              {{ user.value?.role === 'teacher' ? 'Yeni Sınıf Oluştur' : 'Yeni Sınıfa Katıl' }}
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="create-quiz-page">
        <div class="quiz-header-block">
          <h1>Yeni Quiz Oluştur</h1>
          <p>Quiz sorularınızı PDF veya resim formatında yükleyip ders seçerek quiz oluşturabilirsiniz.</p>
        </div>

        <div class="quiz-form-container">
          <form @submit.prevent="createQuiz" class="quiz-form">
            <!-- File Upload Section -->
            <div class="form-section">
              <h2>Quiz Soruları</h2>
              <div class="file-upload-area" :class="{ 'has-file': uploadedFile, 'dragover': isDragOver }" 
                   @drop="handleDrop" 
                   @dragover.prevent="isDragOver = true" 
                   @dragleave="isDragOver = false"
                   @click="triggerFileInput">
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,.webp" 
                  @change="handleFileSelect" 
                  class="file-input"
                  hidden
                />
                <div class="upload-content">
                  <div v-if="!uploadedFile" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <h3>Dosya Yükle</h3>
                    <p>PDF veya resim dosyasını buraya sürükleyin veya tıklayarak seçin</p>
                    <p class="file-types">Desteklenen formatlar: PDF, JPG, PNG, WEBP</p>
                  </div>
                  <div v-else class="uploaded-file">
                    <div class="file-info">
                      <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <div class="file-details">
                        <h4>{{ uploadedFile.name }}</h4>
                        <p>{{ formatFileSize(uploadedFile.size) }}</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeFile" class="remove-file-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lesson Selection -->
            <div class="form-section">
              <h2>Ders Seçimi</h2>
              <div class="lesson-dropdown">
                <button 
                  type="button"
                  @click="toggleLessonDropdown"
                  class="lesson-dropdown-btn"
                  :class="{ active: showLessonDropdown }"
                >
                  <div class="lesson-btn-content">
                    <svg class="lesson-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <span class="lesson-text">{{ selectedLesson?.name || 'Ders Seçin' }}</span>
                  </div>
                  <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                <div v-if="showLessonDropdown" class="lesson-dropdown-menu">
                  <div class="dropdown-header">
                    <h4>Ders Seçin</h4>
                    <button type="button" class="close-dropdown-btn" @click="toggleLessonDropdown">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <div class="dropdown-options">
                    <button 
                      type="button"
                      v-for="lesson in classroomLessons" 
                      :key="lesson.id"
                      @click="selectLesson(lesson)"
                      class="dropdown-option"
                      :class="{ selected: selectedLesson?.id === lesson.id }"
                    >
                      <span>{{ lesson.name }}</span>
                      <svg v-if="selectedLesson?.id === lesson.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quiz Details -->
            <div class="form-section">
              <h2>Quiz Detayları</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="quizTitle">Quiz Başlığı *</label>
                  <input 
                    id="quizTitle"
                    v-model="quizForm.title" 
                    type="text" 
                    placeholder="Quiz başlığını girin"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="quizDescription">Quiz Açıklaması</label>
                  <textarea 
                    id="quizDescription"
                    v-model="quizForm.description" 
                    placeholder="Quiz hakkında kısa bir açıklama yazın"
                    class="form-textarea"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" @click="goBack" class="btn-secondary">
                İptal
              </button>
              <button type="submit" class="btn-primary" :disabled="!isFormValid || isLoading">
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isLoading ? 'Oluşturuluyor...' : 'Quiz Oluştur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import { useNavigation } from '@/composables/useNavigation'

const toast = useToast()
const store = useStore()
const router = useRouter()

// User data
const user = computed(() => store.getters['auth/getUser'])
const userRole = computed(() => user.value?.role || 'student')
const currentPage = ref('Quiz Oluştur')
const notificationCount = ref(3)

// Navigation
const { navItems, isSidebarCollapsed } = useNavigation(userRole)

// Classroom management
const selectedClassroom = ref({
  id: '',
  name: 'Sınıf Seçin'
})
const dropdownOpen = ref(false)
const classroomSearch = ref('')
const classrooms = computed(() => store.getters['classroom/getClassrooms'])

// File upload
const uploadedFile = ref(null)
const isDragOver = ref(false)
const fileInput = ref(null)

// Lesson selection
const selectedLesson = ref(null)
const showLessonDropdown = ref(false)
const classroomLessons = ref([
  { id: 1, name: 'Matematik' },
  { id: 2, name: 'Fizik' },
  { id: 3, name: 'Kimya' },
  { id: 4, name: 'Biyoloji' },
  { id: 5, name: 'Türkçe' },
  { id: 6, name: 'İngilizce' }
])

// Form data
const quizForm = ref({
  title: '',
  description: ''
})

const isLoading = ref(false)

// Computed properties
const filteredClassrooms = computed(() => {
  return classrooms.value.filter(classroom => 
    classroom.name.toLowerCase().includes(classroomSearch.value.toLowerCase())
  )
})

const isFormValid = computed(() => {
  return uploadedFile.value && 
         selectedLesson.value && 
         quizForm.value.title.trim().length > 0 &&
         selectedClassroom.value.id
})

// Methods
const handleLogout = () => {
  const route = userRole.value === 'teacher' ? '/auth/login' : '/auth/login'
  router.push(route)
}

const handleProfile = () => {
  const route = userRole.value === 'teacher' ? '/teacher/profile' : '/student/profile'
  router.push(route)
}

const handleSettings = () => {
  const route = userRole.value === 'teacher' ? '/teacher/settings' : '/student/settings'
  router.push(route)
}

const selectClassroom = (classroom) => {
  selectedClassroom.value = classroom
  dropdownOpen.value = false
  // Here you would fetch lessons for the selected classroom
  // store.dispatch('lesson/fetchClassroomLessons', classroom.id)
}

const joinNewClass = () => {
  const route = userRole.value === 'teacher' ? '/teacher/create-classroom' : '/student/join-classroom'
  router.push(route)
}

// File upload methods
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    toast.error('Desteklenmeyen dosya formatı. PDF, JPG, PNG veya WEBP dosyası seçin.')
    return
  }
  
  if (file.size > maxSize) {
    toast.error('Dosya boyutu 10MB\'dan büyük olamaz.')
    return
  }
  
  uploadedFile.value = file
  toast.success('Dosya başarıyla yüklendi!')
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lesson selection methods
const toggleLessonDropdown = () => {
  showLessonDropdown.value = !showLessonDropdown.value
}

const selectLesson = (lesson) => {
  selectedLesson.value = lesson
  showLessonDropdown.value = false
}

// Form submission
const createQuiz = async () => {
  if (!isFormValid.value) {
    toast.error('Lütfen tüm gerekli alanları doldurun.')
    return
  }
  
  isLoading.value = true
  
  try {
    // Create form data for file upload
    const formData = new FormData()
    formData.append('file', uploadedFile.value)
    formData.append('title', quizForm.value.title)
    formData.append('description', quizForm.value.description)
    formData.append('lessonId', selectedLesson.value.id)
    formData.append('classroomId', selectedClassroom.value.id)
    
    // Here you would call the API to create the quiz
    // await store.dispatch('quiz/createQuiz', { lessonId: selectedLesson.value.id, quizData: formData })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Quiz başarıyla oluşturuldu!')
    
    // Redirect back to quizzes page
    const route = userRole.value === 'teacher' ? '/teacher/dashboard' : '/student/quizzes'
    router.push(route)
    
  } catch (error) {
    console.error('Quiz creation error:', error)
    toast.error('Quiz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  const route = userRole.value === 'teacher' ? '/teacher/dashboard' : '/student/quizzes'
  router.push(route)
}

// Lifecycle
onMounted(async () => {
  // Fetch classrooms
  try {
    await store.dispatch('classroom/fetchClassrooms')
    if (classrooms.value.length > 0) {
      selectedClassroom.value = classrooms.value[0]
    }
  } catch (err) {
    console.log(err)
    toast.error(err.message)
  }
  
  // Fetch classrooms if not already loaded
  if (classrooms.value.length === 0) {
    await store.dispatch('classroom/fetchClassrooms')
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.sidebar-classroom-dropdown {
  position: relative;
  margin-bottom: 18px;
  padding: 0 16px;
  font-family: inherit;
  &.modern-dropdown {
    .dropdown-selected {
      font-size: 1.1rem;
      font-weight: 600;
      background: #232323;
      color: #fff;
      padding: 14px 18px;
      border-radius: 10px;
      width: 100%;
      min-width: 180px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1.5px solid $orange;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      transition: border 0.2s;
    }
    .dropdown-selected:hover, .dropdown-selected:focus {
      border: 1.5px solid darken($orange, 10%);
    }
    .dropdown-selected-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dropdown-arrow {
      margin-left: 10px;
      font-size: 1.1rem;
      transition: transform 0.2s;
      color: #fff;
      &.open {
        transform: rotate(180deg);
      }
    }
    .dropdown-list {
      position: absolute;
      top: 110%;
      left: 0;
      right: 0;
      background: #232323;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);
      z-index: 20;
      width: 100%;
      min-width: 180px;
      padding-bottom: 8px;
      border: 1.5px solid $orange;
      animation: fadeIn 0.18s;
    }
    .dropdown-header {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      padding: 14px 18px 6px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: #232323;
    }
    .dropdown-search-wrapper {
      padding: 8px 18px 0 18px;
    }
    .dropdown-search {
      width: 100%;
      padding: 7px 12px;
      border-radius: 7px;
      border: 1.2px solid rgba(255,255,255,0.1);
      background: #232323;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
    }
    .dropdown-search:focus {
      border: 1.2px solid rgba(255,255,255,0.2);
    }
    .dropdown-items {
      max-height: 220px;
      overflow-y: auto;
      margin-top: 4px;
    }
    .dropdown-item {
      padding: 12px 18px;
      font-size: 1rem;
      color: #fff;
      cursor: pointer;
      text-align: left;
      border-radius: 7px;
      margin: 2px 8px;
      transition: background 0.15s, color 0.15s;
    }
    .dropdown-item.selected, .dropdown-item:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .dropdown-footer {
      padding: 8px 18px 12px 18px;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 4px;
      display: flex;
      justify-content: flex-end;
      background: #232323;
      border-radius: 0 0 12px 12px;
    }
    .join-class-btn {
      width: 100%;
      padding: 10px 16px;
      background: $orange;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      &:hover {
        background: darken($orange, 10%);
        transform: translateY(-1px);
      }
      &:active {
        transform: translateY(0);
      }
    }
    .dropdown-empty {
      padding: 16px 18px;
      color: #888;
      font-size: 1rem;
      text-align: center;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
}

.create-quiz-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 32px;
}

.quiz-header-block {
  background: $orange;
  color: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba($orange, 0.10);
  
  h1 {
    color: #fff;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  p {
    color: rgba(#fff, 0.9);
    font-size: 1.1rem;
    margin: 0;
  }
}

.quiz-form-container {
  background: #111;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  padding: 32px;
}

.quiz-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 32px;
  
  h2 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.file-upload-area {
  border: 2px dashed #333;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #0a0a0a;
  
  &:hover {
    border-color: $orange;
    background: rgba($orange, 0.05);
  }
  
  &.dragover {
    border-color: $orange;
    background: rgba($orange, 0.1);
  }
  
  &.has-file {
    border-color: #27ae60;
    background: rgba(#27ae60, 0.05);
  }
}

.upload-placeholder {
  .upload-icon {
    width: 48px;
    height: 48px;
    color: #666;
    margin-bottom: 16px;
  }
  
  h3 {
    color: #fff;
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  
  p {
    color: #888;
    margin-bottom: 4px;
    
    &.file-types {
      font-size: 0.9rem;
      color: #666;
    }
  }
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(#27ae60, 0.1);
  border-radius: 8px;
  padding: 16px;
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .file-icon {
      width: 32px;
      height: 32px;
      color: #27ae60;
    }
    
    .file-details {
      h4 {
        color: #fff;
        margin: 0 0 4px 0;
        font-size: 1rem;
      }
      
      p {
        color: #888;
        margin: 0;
        font-size: 0.9rem;
      }
    }
  }
  
  .remove-file-btn {
    background: rgba(#e74c3c, 0.2);
    border: none;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: rgba(#e74c3c, 0.3);
    }
    
    svg {
      width: 16px;
      height: 16px;
      color: #e74c3c;
    }
  }
}

.lesson-dropdown {
  position: relative;
  
  .lesson-dropdown-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #181818;
    border: 1.5px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    
    &:hover, &.active {
      border-color: $orange;
    }
    
    .lesson-btn-content {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .lesson-icon {
        width: 20px;
        height: 20px;
        color: #888;
      }
      
      .lesson-text {
        color: #fff;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    
    .dropdown-arrow {
      width: 20px;
      height: 20px;
      color: #888;
      transition: transform 0.2s;
    }
  }
  
  .lesson-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #232323;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    z-index: 10;
    border: 1.5px solid $orange;
    animation: fadeIn 0.18s;
    
    .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      
      h4 {
        margin: 0;
        color: #fff;
        font-size: 1rem;
        font-weight: 700;
      }
      
      .close-dropdown-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        
        svg {
          width: 20px;
          height: 20px;
          color: #888;
        }
      }
    }
    
    .dropdown-options {
      max-height: 220px;
      overflow-y: auto;
      padding: 8px 0;
    }
    
    .dropdown-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      font-size: 1rem;
      color: #fff;
      cursor: pointer;
      border-radius: 7px;
      margin: 2px 8px;
      transition: background 0.15s, color 0.15s;
      background: none;
      border: none;
      width: calc(100% - 16px);
      text-align: left;
      
      &:hover {
        background: rgba(255,255,255,0.1);
      }
      
      &.selected {
        background: rgba(255,255,255,0.1);
        font-weight: 600;
      }
      
      .check-icon {
        width: 20px;
        height: 20px;
        color: $orange;
      }
    }
  }
}

.form-grid {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    color: #fff;
    font-weight: 500;
    font-size: 1rem;
  }
  
  .form-input, .form-textarea {
    background: #181818;
    border: 1.5px solid #333;
    border-radius: 8px;
    padding: 12px 16px;
    color: #fff;
    font-size: 1rem;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: $orange;
    }
    
    &::placeholder {
      color: #666;
    }
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  
  .btn-secondary, .btn-primary {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .btn-secondary {
    background: #333;
    color: #fff;
    
    &:hover {
      background: #444;
    }
  }
  
  .btn-primary {
    background: $orange;
    color: #fff;
    
    &:hover:not(:disabled) {
      background: darken($orange, 10%);
    }
    
    &:disabled {
      background: #666;
      cursor: not-allowed;
    }
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 