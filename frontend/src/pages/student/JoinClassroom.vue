<template>
  <DashboardLayout
    :user-name="user.userProfile.firstName + ' ' + user.userProfile.lastName"
    :user-role="userRole"
    :user-avatar="user.userProfile.avatar"
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #content>
      <div class="join-classroom-page">
        <div class="page-header">
          <h1 class="page-title">Sınıfa Katıl</h1>
          <p class="page-subtitle">Öğretmeninizden aldığınız sınıf kodunu girerek sınıfa katılabilirsiniz.</p>
        </div>

        <div class="join-classroom-container">
          <div class="join-classroom-box">
            <div class="code-input-section">
              <label class="code-label">Sınıf Kodu</label>
              <div class="code-input-wrapper" :class="{ 'is-error': error }">
                <input 
                  type="text" 
                  v-model="classroomCode" 
                  class="code-input"
                  placeholder="Örn: ABC123"
                  @input="handleInput"
                  @keyup.enter="joinClassroom"
                  maxlength="6"
                  ref="codeInput"
                />
              </div>
              <p v-if="error" class="error-message">{{ error }}</p>
              <p class="code-hint">Sınıf kodu 6 karakterden oluşur ve büyük harfler ile rakamları içerir.</p>
            </div>

            <div class="join-actions">
              <button 
                class="btn btn-primary join-btn" 
                @click="joinClassroom"
                :disabled="isLoading || !isValidCode"
              >
                <span v-if="!isLoading">Sınıfa Katıl</span>
                <span v-else class="loading-spinner"></span>
              </button>
              <button class="btn btn-secondary cancel-btn" @click="goBack">
                Vazgeç
              </button>
            </div>
          </div>

          <div class="join-info-box">
            <h3 class="info-title">Sınıf Kodu Nasıl Alınır?</h3>
            <div class="info-steps">
              <div class="info-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Öğretmeninizden Kodu İsteyin</h4>
                  <p>Her sınıfın benzersiz bir kodu vardır. Bu kodu öğretmeninizden alabilirsiniz.</p>
                </div>
              </div>
              <div class="info-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Kodu Girin</h4>
                  <p>Aldığınız kodu yukarıdaki alana girin. Kod büyük harfler ve rakamlardan oluşur.</p>
                </div>
              </div>
              <div class="info-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Sınıfa Katılın</h4>
                  <p>Kodu girdikten sonra "Sınıfa Katıl" butonuna tıklayarak sınıfa dahil olun.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import { useToast } from 'vue-toastification'
const store = useStore()
const router = useRouter()
const user = computed(() => store.getters['auth/getUser'])
const toast = useToast()
// User data
const userRole = ref('Student')
const currentPage = ref(1)
const notificationCount = ref(3)

// Form state
const classroomCode = ref('')
const error = ref('')
const isLoading = ref(false)
const codeInput = ref(null)

// Computed
const isValidCode = computed(() => {
  const code = classroomCode.value
  return code.length === 6 && /^[A-Z0-9]+$/.test(code)
})

// Methods
const handleInput = () => {
  // Convert to uppercase and remove invalid characters
  classroomCode.value = classroomCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  error.value = ''
}

const joinClassroom = async () => {
  if (!isValidCode.value) {
    error.value = 'Lütfen geçerli bir sınıf kodu girin'
    return
  }

  try {
    isLoading.value = true
    // Call the store action to join classroom
    await store.dispatch('classroom/joinClassroom', classroomCode.value).then(() => { 
      router.push({name: 'dashboard'})
      toast.success('Sınıfa başarıyla katıldınız')
    }).catch((err) => {
      error.value = err.message || 'Sınıfa katılırken bir hata oluştu'
    })
  } catch (err) {
    error.value = err.message || 'Sınıfa katılırken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/student/profile')
}

const handleSettings = () => {
  router.push('/student/settings')
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.join-classroom-page {
  padding: $space-m;
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.page-header {
  margin-bottom: $space-xl;
  text-align: center;

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: $space-s;
    color: #fff;
  }

  .page-subtitle {
    font-size: $font-size-m;
    color: #888;
    max-width: 600px;
    margin: 0 auto;
  }
}

.join-classroom-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-xl;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.join-classroom-box {
  background: #111;
  border: 2px solid rgba(136, 136, 136, 0.5);
  border-radius: 18px;
  padding: $space-xl;
}

.code-input-section {
  margin-bottom: $space-l;

  .code-label {
    display: block;
    font-size: $font-size-m;
    font-weight: 600;
    margin-bottom: $space-s;
    color: #fff;
  }

  .code-input-wrapper {
    margin-bottom: $space-s;
    
    &.is-error {
      .code-input {
        border-color: #ff4444;
      }
    }
  }

  .code-input {
    width: 100%;
    padding: 16px;
    font-size: 1.5rem;
    letter-spacing: 4px;
    text-align: center;
    background: #000;
    border: 2px solid rgba(136, 136, 136, 0.5);
    border-radius: 12px;
    color: #fff;
    font-family: monospace;
    transition: all 0.2s;

    &:focus {
      border-color: #888;
      outline: none;
    }

    &::placeholder {
      letter-spacing: normal;
      font-size: $font-size-m;
      color: #666;
    }
  }

  .error-message {
    color: #ff4444;
    font-size: $font-size-s;
    margin-top: $space-xs;
  }

  .code-hint {
    font-size: $font-size-s;
    color: #666;
    margin-top: $space-s;
  }
}

.join-actions {
  display: flex;
  gap: $space-m;

  .join-btn, .cancel-btn {
    flex: 1;
    padding: $space-m;
    font-size: $font-size-m;
    font-weight: 600;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .join-btn {
    background: #e67e22;
    color: #fff;
    border: none;

    &:hover:not(:disabled) {
      background: darken(#e67e22, 10%);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .cancel-btn {
    background: transparent;
    border: 2px solid #888;
    color: #888;

    &:hover {
      background: rgba(136, 136, 136, 0.1);
    }
  }
}

.join-info-box {
  background: #111;
  border: 2px solid rgba(136, 136, 136, 0.5);
  border-radius: 18px;
  padding: $space-xl;

  .info-title {
    font-size: $font-size-l;
    font-weight: 700;
    margin-bottom: $space-l;
    color: #fff;
    text-align: center;
  }
}

.info-steps {
  display: flex;
  flex-direction: column;
  gap: $space-l;
}

.info-step {
  display: flex;
  gap: $space-m;
  align-items: flex-start;

  .step-number {
    width: 32px;
    height: 32px;
    background: #e67e22;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content {
    h4 {
      font-size: $font-size-m;
      font-weight: 600;
      margin-bottom: $space-xs;
      color: #fff;
    }

    p {
      font-size: $font-size-s;
      color: #888;
      line-height: 1.5;
    }
  }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 