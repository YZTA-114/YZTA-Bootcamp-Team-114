<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #breadcrumb>
      <span>Quiz Detayı</span>
    </template>
    <template #sidebar-classroom-dropdown>
      <ClassroomDropdown />
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="quiz-detail-page">
        <div class="quiz-header-block">
          <h1>{{ quiz?.name }}</h1>
          <p class="quiz-description">{{ quiz?.description }}</p>
        </div>

        <div class="quiz-info-card">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">Ders</span>
              <span class="info-value">{{ quiz?.lesson?.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Süre</span>
              <span class="info-value">{{ quiz?.timeLimit }} dakika</span>
            </div>
            <div class="info-item">
              <span class="info-label">Soru Sayısı</span>
              <span class="info-value">{{ quiz?.questions?.length }}</span>
            </div>
          </div>

          <div class="quiz-rules">
            <h3>Quiz Kuralları</h3>
            <ul>
              <li>Quiz başladıktan sonra süre işlemeye başlayacaktır.</li>
              <li>Süre bittiğinde quiz otomatik olarak sonlandırılacaktır.</li>
              <li>Her soruyu cevapladıktan sonra ileri/geri gidebilirsiniz.</li>
              <li>Quiz'i bitirmeden önce cevaplarınızı kontrol edebilirsiniz.</li>
            </ul>
          </div>

          <div class="action-buttons">
            <button 
              class="start-quiz-btn" 
              @click="startQuiz"
              :disabled="loading"
            >
              {{ loading ? 'Yükleniyor...' : 'Quiz\'e Başla' }}
            </button>
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

const currentPage = ref('Quiz Detayı')
const notificationCount = ref(0)
const loading = ref(false)

const user = computed(() => store.getters['auth/getUser'])
const userRole = computed(() => user.value?.role || 'student')
const { navItems, isSidebarCollapsed } = useNavigation(userRole)

const quiz = computed(() => store.getters['quiz/getCurrentQuiz'])

onMounted(async () => {
  try {
    await store.dispatch('quiz/fetchQuizById', route.params.id)
  } catch (error) {
    toast.error('Quiz yüklenirken bir hata oluştu')
    router.push('/student/quizzes')
  }
})

const startQuiz = async () => {
  try {
    loading.value = true
    // Create a quiz take record
    const quizTake = await store.dispatch('quiz/startQuiz', {
      quizId: route.params.id,
      userId: user.value._id
    })
    
    // Navigate to take quiz page with quiz take id
    router.push({
      name: 'take-quiz',
      params: { 
        quizId: route.params.id,
        quizTakeId: quizTake._id
      }
    })
  } catch (error) {
    toast.error('Quiz başlatılırken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

const handleLogout = () => router.push('/auth/login')
const handleProfile = () => router.push('/student/profile')
const handleSettings = () => router.push('/student/settings')
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.quiz-detail-page {
  background: $black;
  color: $white;
  min-height: 100vh;
  padding: 32px;
}

.quiz-header-block {
  background: $orange;
  color: $white;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba($orange, 0.1);

  h1 {
    color: $white;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .quiz-description {
    color: rgba($white, 0.9);
    font-size: 1.1rem;
    margin: 0;
  }
}

.quiz-info-card {
  background: #111;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.info-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #222;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  color: #888;
  font-size: 0.9rem;
}

.info-value {
  color: $white;
  font-size: 1.2rem;
  font-weight: 600;
}

.quiz-rules {
  margin-bottom: 32px;

  h3 {
    color: $white;
    font-size: 1.4rem;
    margin: 0 0 16px 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      color: #ddd;
      font-size: 1.1rem;
      margin-bottom: 12px;
      padding-left: 24px;
      position: relative;

      &:before {
        content: "•";
        color: $orange;
        position: absolute;
        left: 0;
      }
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.start-quiz-btn {
  background: $pink;
  color: $white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;

  &:hover:not(:disabled) {
    background: darken($pink, 5%);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
}
</style> 