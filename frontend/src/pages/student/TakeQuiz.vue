<template>
  <div class="take-quiz-container">
    <div v-if="loading || submitting" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">{{ submitting ? 'Quiz gönderiliyor...' : 'Quiz yükleniyor...' }}</div>
    </div>
    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button class="retry-btn" @click="loadQuiz">Tekrar Dene</button>
    </div>
    <div v-else class="main-content">
      <div class="question-sidebar">

        <div class="timer-container">
          <div class="timer-circle">
            <div class="timer-label">Remaining Time</div>
            <div class="timer-display">{{ timerDisplay }}</div>
            <div class="timer-units">
              <span>Hours</span>
              <span>Min</span>
              <span>Sec</span>
            </div>
          </div>
        </div>
        <div 
          class="question-grid"
          :class="{
            'cols-5': quizQuestions.length >= 20,
            'cols-4': quizQuestions.length >= 10 && quizQuestions.length < 20,
            'cols-3': quizQuestions.length < 10
          }"
        >
          <button
            v-for="(question, idx) in quizQuestions"
            :key="question.id"
            class="question-btn"
            :class="{ current: idx === currentQuestionIndex }"
            @click="goToQuestion(idx)"
          >
            {{ idx + 1 }}
          </button>
        </div>
        <div class="user-profile">
          <div class="profile-icon">
            <div class="placeholder-icon">?</div>
          </div>
          <div class="profile-info">
            <div class="user-name">{{ user.userProfile.firstName }} {{ user.userProfile.lastName }}</div>
            <div class="user-role">Student</div>
          </div>
        </div>
      </div>
      <div class="quiz-content">
        <div class="quiz-header">
          <div class="question-header-row">
            <span class="question-label">Soru {{ currentQuestionIndex + 1 }}</span>
          </div>
        </div>
        
        <div class="question-container">
          <div class="question-content">
            <div class="question-actions-top">
              <SecondaryButton>
                <ri-volume-up-line />
                Soruyu Seslendir
              </SecondaryButton>
              <SecondaryButton>
                <ri-mic-line style="margin-right: 6px;" />
                Yanıt Ver
              </SecondaryButton>
            </div>
            <div class="question-text" v-html="currentQuestion.text"></div>
            
            <div class="options-list">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="option-item"
                :class="{ selected: selectedAnswers[currentQuestionIndex] === index }"
                @click="selectAnswer(index)"
              >
                <div class="option-letter">{{ String.fromCharCode(65 + index) }})</div>
                <div class="option-text">{{ option.content }}</div>
                <div class="option-check" v-if="selectedAnswers[currentQuestionIndex] === index">
                  <ri-check-line />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quiz-navigation">
          <div class="nav-inner">
            <button class="nav-btn round-pink" @click="previousQuestion" :disabled="currentQuestionIndex === 0">
              <ri-arrow-left-line />
            </button>
            <span class="question-counter">{{ currentQuestionIndex + 1 }} / {{ quizQuestions.length }}</span>
            <button class="nav-btn round-pink" @click="nextQuestion" :disabled="currentQuestionIndex === quizQuestions.length - 1">
              <ri-arrow-right-line />
            </button>
          </div>
        </div>
        <SecondaryButton
          v-if="currentQuestionIndex === quizQuestions.length - 1"
          class="finish-btn-fixed"
          @click="submitQuiz"
          :disabled="submitting"
        >
          {{ submitting ? 'Gönderiliyor...' : 'Sınavı Bitir' }}
        </SecondaryButton>
        
        <!-- quiz-actions buttons removed as requested -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import SecondaryButton from '@/components/custom/button/SecondaryButton.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()

const user = computed(() => store.getters['auth/getUser']);

const loading = ref(true)
const submitting = ref(false)
const error = ref(null)
const totalSeconds = ref(0)
const timerDisplay = computed(() => {
  const hours = Math.floor(totalSeconds.value / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((totalSeconds.value % 3600) / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds.value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

let timerInterval = null

const loadQuiz = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch quiz data
    const quizResponse = await store.dispatch('quiz/fetchQuizById', route.params.quizId)
    console.log('Raw Quiz Response:', quizResponse)
    
    if (!quizResponse || !quizResponse.questions) {
      throw new Error('Quiz verisi alınamadı')
    }
    
    // Fetch quiz take to verify it exists and is valid
    const quizTakeResponse = await store.dispatch('quizTake/fetchQuizTakeById', route.params.quizTakeId)
    console.log('Raw Quiz Take Response:', quizTakeResponse)
    
    if (!quizTakeResponse || quizTakeResponse.status !== 'uncompleted') {
      toast.error('Bu quiz zaten tamamlanmış veya süresi dolmuş')
      router.push('/student/quizzes')
      return
    }

    // Set up timer
    totalSeconds.value = quizResponse.timeLimit * 60 // Convert minutes to seconds
    timerInterval = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        // Time's up - submit quiz
        submitQuiz()
      }
    }, 1000)

    // Set up questions
    console.log('Questions before mapping:', quizResponse.questions)
    quizQuestions.value = quizResponse.questions.map(q => {
      console.log('Processing question:', q)
      console.log('Question options:', q.options)
      return {
        id: q._id,
        text: q.content,
        options: Array.isArray(q.options) ? q.options.map(opt => ({
          id: opt._id,
          content: opt.content
        })) : []
      }
    })

    console.log('Final Quiz Questions:', quizQuestions.value)

  } catch (error) {
    console.error('Error in loadQuiz:', error)
    error.value = error.message || 'Quiz yüklenirken bir hata oluştu'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuiz()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

const submitQuiz = async () => {
  try {
    submitting.value = true
    clearInterval(timerInterval)
    
    // Collect all answers
    const answers = []
    quizQuestions.value.forEach((question, index) => {
      if (selectedAnswers.value[index] !== undefined) {
        const selectedOption = question.options[selectedAnswers.value[index]]
        answers.push({
          questionId: question.id,
          answerOption: selectedOption.id
        })
      }
    })

    // Submit quiz
    await store.dispatch('quiz/submitQuiz', {
      quizTakeId: route.params.quizTakeId,
      answers: answers
    })
    
    console.log("Answers", answers);
    toast.success('Quiz başarıyla tamamlandı')
    router.push('/student/quizzes')
  } catch (error) {
    console.error('Error submitting quiz:', error)
    toast.error('Quiz gönderilirken bir hata oluştu')
  } finally {
    submitting.value = false
  }
}

const currentQuestionIndex = ref(0)
const selectedAnswers = ref({})

const selectAnswer = (optionIndex) => {
  selectedAnswers.value[currentQuestionIndex.value] = optionIndex
}

const quizQuestions = ref([])
const currentQuestion = computed(() => {
  return quizQuestions.value[currentQuestionIndex.value]
})

const nextQuestion = () => {
  if (currentQuestionIndex.value < quizQuestions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const goToQuestion = (idx) => {
  currentQuestionIndex.value = idx
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.take-quiz-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $black;
  font-family: $font-family-primary-regular;
}

.main-content {
  display: flex;
  gap: $space-l;
  padding: $space-l;
  box-sizing: border-box;
  flex: 1;
  overflow: hidden;
}

.question-sidebar {
  width: 350px;
  background: $black;
  border-radius: 12px;
  padding: $space-l;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  height: calc(100vh - 2 * $space-l);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $space-m;
  text-align: center;
  flex-shrink: 0;
  background: $orange;
  padding: $space-m;
  border-radius: 8px;
  font-family: serif;
  text-transform: capitalize;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: $space-s;
  padding: $space-s;
  background: #333;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: auto;
}

.profile-icon {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #e3f2fd;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
}

.placeholder-icon {
  color: #1976d2;
  font-size: 18px;
  font-weight: bold;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  color: $white;
}

.user-role {
  font-size: 11px;
  color: #ccc;
  font-weight: $font-weight-regular;
}

.timer-container {
  display: flex;
  justify-content: center;
  margin-bottom: $space-l;
  flex-shrink: 0;
}

.timer-circle {
  width: 160px;
  height: 160px;
  border-radius: 60%;
  background: $black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-s;
}

.timer-label {
  font-size: 10px;
  color: $white;
  margin-bottom: 2px;
  font-weight: $font-weight-regular;
}

.timer-display {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $pink;
  margin-bottom: 2px;
  font-family: monospace;
  line-height: 1;
}

.timer-units {
  display: flex;
  gap: 4px;
  font-size: 9px;
  color: $white;
  font-weight: $font-weight-regular;
}

.question-grid {
  display: grid;
  gap: $space-xs;
  margin-bottom: $space-m;
}
.question-grid.cols-5 {
  grid-template-columns: repeat(5, 1fr);
}
.question-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
.question-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.question-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f8f9fa;
  color: $black;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &.current {
    background: $pink;
    color: $white;
    font-weight: $font-weight-bold;
    box-shadow: 0 2px 8px rgba($pink, 0.15);
  }
}

.status-answered {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-not-answered {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-marked {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-answered-marked {
  background: $pink;
  color: $white;
  border-color: $pink;
}

.status-current {
  background: $white;
  color: $black;
  border-color: $pink;
  box-shadow: 0 0 0 2px $pink;
}

.status-not-visited {
  background: #555;
  color: #ccc;
  border-color: #777;
}

.quiz-content {
  flex: 1;
  background: $white;
  border-radius: 12px;
  padding: $space-m;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  height: calc(100vh - 2 * $space-l);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quiz-header {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: $space-xs;
  padding-bottom: $space-s;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.question-header-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.question-label {
  font-size: 1.1rem;
  font-weight: $font-weight-bold;
  color: $pink;
  margin-left: 0;
  margin-bottom: 0;
  letter-spacing: 0.5px;
}

.question-number {
  display: none;
}

.question-text {
  font-size: 1.25rem;
  line-height: 1.5;
  color: $black;
  margin-bottom: $space-s;
  flex-shrink: 0;
  max-height: 220px;
  overflow-y: auto;

  .question-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-s;
  }

  .speech-bubble {
    background: $white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: $space-s;
    margin-bottom: $space-s;
    position: relative;
    width: 100%;
    max-width: 90%;
    
    p {
      margin: 0;
      font-size: $font-size-xs;
      line-height: 1.4;
    }
  }

  .text-excerpt {
    background: $white;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: $space-xs;
    margin-bottom: $space-s;
    
    p {
      margin: 0;
      font-size: $font-size-xs;
      line-height: 1.4;
    }
  }
}

.question-actions-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: $space-m;
  margin-bottom: $space-s;
}
.question-actions-top > :deep(button) {
  min-width: 160px;
  height: 44px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 1rem;
  box-sizing: border-box;
}

.question-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-m;
}
.question-text {
  flex: 1 1 0;
}
.question-actions-inline {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  align-items: flex-end;
  margin-left: $space-m;
}
.audio-btn.small {
  font-size: 0.95rem;
  padding: 4px 10px;
  min-width: 120px;
  height: 32px;
  border-radius: 6px;
  white-space: nowrap;
}

.question-actions {
  display: flex;
  gap: $space-s;
  margin-bottom: $space-s;
  flex-shrink: 0;
}

.audio-btn {
  display: flex;
  align-items: center;
  gap: $space-xs;
  background: $white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: $space-s $space-m;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  color: $black;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    border-color: $pink;
    background: #fef7f7;
  }

  &:active {
    transform: scale(0.98);
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: $space-xs;
  background: $white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: $space-xs;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 35px;

  &:hover {
    border-color: $pink;
    background: #fef7f7;
  }

  &.selected {
    border-color: $pink;
    background: #fef7f7;
    box-shadow: 0 2px 8px rgba($pink, 0.15);
  }
}

.option-letter {
  font-weight: $font-weight-bold;
  color: $pink;
  min-width: 25px;
  flex-shrink: 0;
  font-size: $font-size-s;
  margin-top: 2px;
}

.option-text {
  flex: 1;
  font-size: 1.25rem;
  line-height: 1.5;
  color: $black;
  /* max-height removed for better readability */
  overflow-y: auto;
}

.option-check {
  width: 20px;
  height: 20px;
  background: $pink;
  color: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
}

// Quiz navigation bottom bar
.quiz-navigation {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  background: $white;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
  padding-top: $space-m;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  z-index: 2;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  width: 100%;
}
.nav-btn.round-pink {
  background: $pink;
  color: $white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba($pink, 0.10);
  outline: none;
  &:hover:not(:disabled) {
    background: darken($pink, 10%);
    transform: scale(1.07);
  }
  &:disabled {
    background: #f3c2d6;
    color: #fff;
    cursor: not-allowed;
    opacity: 0.7;
  }
}
.question-counter {
  font-size: 1.15rem;
  font-weight: $font-weight-semi-bold;
  color: $black;
  min-width: 60px;
  text-align: center;
  letter-spacing: 0.5px;
}

.btn {
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-xs $space-m;
  border: none;
  border-radius: 8px;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-1px);
  }
}

.btn-primary {
  background: $pink;
  color: $white;
  
  &:hover {
    background: darken($pink, 10%);
    box-shadow: 0 4px 8px rgba($pink, 0.3);
  }
}
.finish-btn-fixed {
  position: fixed;
  right: 48px;
  bottom: 48px;
  min-width: 140px;
  height: 48px;
  font-size: 1rem;
  font-weight: $font-weight-semi-bold;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: $black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid $pink;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: $white;
  font-size: 1.2rem;
  font-weight: 500;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: $black;
  padding: 20px;
}

.error-message {
  color: $white;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
}

.retry-btn {
  background: $pink;
  color: $white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: darken($pink, 5%);
    transform: translateY(-1px);
  }
}
</style>



