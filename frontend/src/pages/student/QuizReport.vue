<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #breadcrumb>
      <span>Quiz Raporu</span>
    </template>
    <template #sidebar-classroom-dropdown>
      <ClassroomDropdown />
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="quiz-report-page">
        <div class="report-header-block">
          <h1>{{ quiz?.name }} - Quiz Raporu</h1>
          <p class="quiz-description">{{ quiz?.description }}</p>
        </div>

        <div v-if="loading" class="loading-state">
          <p>Yükleniyor...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="loadQuizData" class="retry-btn">Tekrar Dene</button>
        </div>

        <div v-else class="report-content">
          <div class="report-summary-card">
            <div class="summary-header">
              <h2>Quiz Özeti</h2>
            </div>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="label">Toplam Soru</span>
                <span class="value">{{ quizReport?.totalQuestions }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Doğru Sayısı</span>
                <span class="value correct">{{ quizReport?.correctAnswers }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Yanlış Sayısı</span>
                <span class="value incorrect">{{ incorrectAnswers }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Başarı Oranı</span>
                <span class="value">{{ successRate }}%</span>
              </div>
              <div class="summary-item">
                <span class="label">Harcanan Süre</span>
                <span class="value">{{ quizReport?.timeSpentMinutes }} dakika</span>
              </div>
              <div class="summary-item">
                <span class="label">Rapor Tarihi</span>
                <span class="value">{{ formatDate(quizReport?.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- AI Report Section -->
          <div v-if="quizReport?.aiReport" class="ai-report-card">
            <div class="ai-report-header">
              <h2>AI Değerlendirmesi</h2>
            </div>
            <div class="ai-report-content">
              <p>{{ quizReport.aiReport }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import ClassroomDropdown from '@/components/dashboard/ClassroomDropdown.vue'
import { useNavigation } from '@/composables/useNavigation'

const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()

const currentPage = ref('Quiz Raporu')
const notificationCount = ref(0)
const loading = ref(true)
const error = ref(null)

const user = computed(() => store.getters['auth/getUser'])
const userRole = computed(() => user.value?.role || 'student')
const { navItems, isSidebarCollapsed } = useNavigation(userRole)

const quiz = computed(() => store.getters['quiz/getCurrentQuiz'])
const quizReport = computed(() => store.getters['quiz/quizReport/getCurrentQuizReport'])

const incorrectAnswers = computed(() => {
  if (!quizReport.value) return 0
  return quizReport.value.totalQuestions - quizReport.value.correctAnswers
})

const successRate = computed(() => {
  if (!quizReport.value?.totalQuestions) return 0
  return Math.round((quizReport.value.correctAnswers / quizReport.value.totalQuestions) * 100)
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('tr-TR')
}

const handleLogout = () => router.push('/auth/login')
const handleProfile = () => router.push('/student/profile')
const handleSettings = () => router.push('/student/settings')

const loadQuizData = async () => {
  loading.value = true
  error.value = null
  try {
    await store.dispatch('quiz/fetchQuizById', route.params.quizId)
    await store.dispatch('quiz/quizReport/fetchQuizReportByQuizTakeId', route.params.quizTakeId)
  } catch (err) {
    error.value = 'Quiz raporu yüklenirken bir hata oluştu'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(loadQuizData)
</script>

<style lang="scss" scoped>
@import "@/assets/scss/custom/_variable.scss";

.quiz-report-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 32px;
}

.report-header-block {
  background: $orange;
  color: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba($orange, 0.1);

  h1 {
    color: #fff;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
  }

  .quiz-description {
    margin-top: 8px;
    opacity: 0.9;
  }
}

.loading-state, .error-state {
  text-align: center;
  padding: 48px;
  background: #111;
  border-radius: 12px;
  margin-top: 24px;

  p {
    margin: 0;
    font-size: 1.1rem;
    color: #888;
  }
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  background: $orange;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: darken($orange, 5%);
  }
}

.report-summary-card, .ai-report-card {
  background: #111;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;

  .summary-header, .ai-report-header {
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}

.ai-report-content {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label {
    color: #888;
    font-size: 0.9rem;
  }

  .value {
    font-size: 1.2rem;
    font-weight: 600;

    &.correct {
      color: #2ecc71;
    }

    &.incorrect {
      color: #e74c3c;
    }
  }
}
</style>
