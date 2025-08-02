<template>
  <DashboardLayout
    :user-name="userName"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>

    <template #content>
      <div class="teacher-quiz">
        <!-- Header Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Quiz Yönetimi</h1>
            <p class="welcome-subtitle">Quizlerinizi oluşturun, düzenleyin ve yönetin</p>
          </div>
        </div>

        <!-- Quiz Content -->
        <div class="quiz-content">
          <!-- Quiz Stats Cards -->
          <div class="quiz-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ quizStats.totalQuizzes }}</h3>
                <p>Toplam Quiz</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ quizStats.activeQuizzes }}</h3>
                <p>Aktif Quiz</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ quizStats.totalAttempts }}</h3>
                <p>Toplam Deneme</p>
              </div>
            </div>
          </div>

          <!-- Quiz List -->
          <div class="quiz-list-section">
            <div class="section-header">
              <h2>Quizlerim</h2>
              <div class="filter-controls">
                <div class="filter-dropdown">
                  <button 
                    @click="toggleFilterDropdown"
                    class="filter-dropdown-btn"
                    :class="{ active: showFilterDropdown }"
                  >
                    <div class="filter-btn-content">
                      <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                      </svg>
                      <span class="filter-text">{{ getFilterText(selectedFilter) }}</span>
                    </div>
                    <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </button>
                  
                  <div v-show="showFilterDropdown" class="filter-dropdown-menu">
                    <div class="dropdown-header">
                      <h4>Durum Seçin</h4>
                      <button class="close-dropdown-btn" @click="toggleFilterDropdown">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <div class="dropdown-options">
                      <button 
                        @click="selectFilter('all')"
                        class="dropdown-option"
                        :class="{ selected: selectedFilter === 'all' }"
                      >
                        <span>Tümü</span>
                        <svg v-if="selectedFilter === 'all'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </button>
                      <button 
                        @click="selectFilter('active')"
                        class="dropdown-option"
                        :class="{ selected: selectedFilter === 'active' }"
                      >
                        <span>Aktif</span>
                        <svg v-if="selectedFilter === 'active'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </button>
                      <button 
                        @click="selectFilter('draft')"
                        class="dropdown-option"
                        :class="{ selected: selectedFilter === 'draft' }"
                      >
                        <span>Taslak</span>
                        <svg v-if="selectedFilter === 'draft'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </button>
                      <button 
                        @click="selectFilter('completed')"
                        class="dropdown-option"
                        :class="{ selected: selectedFilter === 'completed' }"
                      >
                        <span>Tamamlanan</span>
                        <svg v-if="selectedFilter === 'completed'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="quiz-grid">
              <div 
                v-for="quiz in filteredQuizzes" 
                :key="quiz.id" 
                class="quiz-card"
                :class="{ 'draft': quiz.status === 'draft', 'active': quiz.status === 'active' }"
              >
                <div class="quiz-header">
                  <div class="quiz-status" :class="quiz.status">{{ getStatusText(quiz.status) }}</div>
                  <div class="quiz-actions">
                    <button @click="editQuiz(quiz)" class="action-btn edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button @click="deleteQuiz(quiz)" class="action-btn delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="quiz-content-card">
                  <h3 class="quiz-title">{{ quiz.title }}</h3>
                  <p class="quiz-description">{{ quiz.description }}</p>
                  
                  <div class="quiz-meta">
                    <div class="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <span>{{ quiz.duration }} dk</span>
                    </div>
                    <div class="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                      </svg>
                      <span>{{ quiz.questionCount }} soru</span>
                    </div>
                    <div class="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      <span>{{ quiz.attempts }} deneme</span>
                    </div>
                  </div>
                  
                  <div class="quiz-footer">
                    <div class="quiz-date">{{ formatDate(quiz.createdAt) }}</div>
                    <div class="quiz-score" v-if="quiz.averageScore">
                      Ort. Puan: {{ quiz.averageScore }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredQuizzes.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                </svg>
              </div>
              <h3>Henüz quiz yok</h3>
              <p>İlk quizinizi oluşturmak için "Yeni Quiz Oluştur" butonuna tıklayın.</p>
            </div>
          </div>
          
          <!-- Action Button Section - Moved Below Quiz Content -->
          <div class="action-section-bottom">
            <button class="btn btn-transparent" @click="createNewQuiz">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Yeni Quiz Oluştur
            </button>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

const router = useRouter()

// User data
const userName = ref('Öğretmen Adı')
const userRole = ref('Öğretmen')
const userAvatar = ref('/api/placeholder/40/40')
const currentPage = ref('Quizler')
const notificationCount = ref(3)
const isSidebarCollapsed = ref(false)

// Navigation items
const navItems = ref([
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/teacher/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'courses',
    label: 'Derslerim',
    path: '/teacher/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'quizzes',
    label: 'Quizler',
    path: '/teacher/quizzes',
    icon: 'ri-task-line'
  },
  {
    id: 'students',
    label: 'Öğrenciler',
    path: '/teacher/students',
    icon: 'ri-group-line'
  },
  {
    id: 'grades',
    label: 'Notlar',
    path: '/teacher/grades',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'analytics',
    label: 'Analitik',
    path: '/teacher/analytics',
    icon: 'ri-analytics-line'
  },
  {
    id: 'profile',
    label: 'Profil',
    path: '/teacher/profile',
    icon: 'ri-user-line'
  }
])

// Methods
const handleLogout = () => {
  console.log('Logout clicked')
  router.push('/login')
}

const handleProfile = () => {
  console.log('Profile clicked')
}

const handleSettings = () => {
  console.log('Settings clicked')
}

// Quiz stats data
const quizStats = ref({
  totalQuizzes: 12,
  activeQuizzes: 8,
  totalAttempts: 156
})

// Filter state
const selectedFilter = ref('all')
const showFilterDropdown = ref(false)

// Sample quiz data
const quizzes = ref([
  {
    id: 1,
    title: 'Matematik Temel Kavramlar',
    description: 'Temel matematik kavramları ve işlemler üzerine quiz',
    status: 'active',
    duration: 30,
    questionCount: 15,
    attempts: 24,
    averageScore: 85,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Türkçe Dil Bilgisi',
    description: 'Türkçe dil bilgisi kuralları ve uygulamaları',
    status: 'active',
    duration: 25,
    questionCount: 12,
    attempts: 18,
    averageScore: 78,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    title: 'Fen Bilimleri Quiz',
    description: 'Fen bilimleri konularında genel bilgi testi',
    status: 'draft',
    duration: 40,
    questionCount: 20,
    attempts: 0,
    averageScore: null,
    createdAt: new Date('2024-01-25')
  },
  {
    id: 4,
    title: 'Tarih Bilgisi',
    description: 'Türk tarihi ve dünya tarihi konuları',
    status: 'completed',
    duration: 35,
    questionCount: 18,
    attempts: 32,
    averageScore: 92,
    createdAt: new Date('2024-01-10')
  }
])

// Computed property for filtered quizzes
const filteredQuizzes = computed(() => {
  if (selectedFilter.value === 'all') {
    return quizzes.value
  }
  return quizzes.value.filter(quiz => quiz.status === selectedFilter.value)
})

// Methods
const createNewQuiz = () => {
  console.log('Create new quiz clicked')
  // Quiz creation logic will be implemented here
}

const editQuiz = (quiz) => {
  console.log('Edit quiz:', quiz.title)
  // Quiz editing logic will be implemented here
}

const deleteQuiz = (quiz) => {
  console.log('Delete quiz:', quiz.title)
  // Quiz deletion logic will be implemented here
  if (confirm(`"${quiz.title}" quizini silmek istediğinizden emin misiniz?`)) {
    const index = quizzes.value.findIndex(q => q.id === quiz.id)
    if (index > -1) {
      quizzes.value.splice(index, 1)
    }
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'active': 'Aktif',
    'draft': 'Taslak',
    'completed': 'Tamamlandı'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
}

const selectFilter = (filter) => {
  selectedFilter.value = filter
  showFilterDropdown.value = false
}

const getFilterText = (filter) => {
  const filterMap = {
    'all': 'Tümü',
    'active': 'Aktif',
    'draft': 'Taslak',
    'completed': 'Tamamlanan'
  }
  return filterMap[filter] || 'Tümü'
}

// Lifecycle
onMounted(() => {
  console.log('Teacher quiz page mounted')
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.teacher-quiz {
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  background: transparent;
  color: #ffffff;

  .welcome-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #ea8014 0%, #f39c12 100%);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .welcome-content {
      .welcome-title {
        font-size: 2rem;
        font-weight: $font-weight-bold;
        font-family: $font-family-primary-bold;
        color: $white;
        margin-bottom: 0.5rem;
      }

      .welcome-subtitle {
        color: $white;
        font-size: 1.1rem;
        font-family: $font-family-primary-regular;
        font-weight: $font-weight-regular;
        margin: 0;
      }
    }

  }

  .quiz-content {
    padding: 1.5rem;

    // Quiz Stats Cards
    .quiz-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;

      .stat-card {
        background: rgba($white, 0.05);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid rgba($white, 0.1);
        transition: all 0.3s ease;

        &:hover {
          background: rgba($white, 0.08);
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, $orange 0%, $yellow 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          svg {
            width: 24px;
            height: 24px;
            stroke: $white;
          }
        }

        .stat-info {
          h3 {
            font-size: 2rem;
            font-weight: $font-weight-bold;
            font-family: $font-family-primary-bold;
            color: $white;
            margin: 0 0 0.25rem 0;
          }

          p {
            font-size: 0.9rem;
            font-family: $font-family-primary-regular;
            color: rgba($white, 0.7);
            margin: 0;
          }
        }
      }
    }

    // Quiz List Section
    .quiz-list-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h2 {
          font-size: 1.5rem;
          font-weight: $font-weight-bold;
          font-family: $font-family-primary-bold;
          color: $white;
          margin: 0;
        }

        .filter-controls {
          .filter-dropdown {
            position: relative;
            
            .filter-dropdown-btn {
              background: rgba($white, 0.05);
              border: 1px solid rgba($white, 0.1);
              border-radius: 8px;
              padding: 0.75rem 1rem;
              color: $white;
              font-family: $font-family-primary-regular;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.75rem;
              min-width: 160px;
              transition: all 0.2s ease;
              
              &:hover {
                background: rgba($white, 0.08);
                border-color: rgba($white, 0.2);
              }
              
              &.active {
                border-color: $orange;
                background: rgba($orange, 0.1);
              }
              
              .filter-btn-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                
                .filter-icon {
                  width: 16px;
                  height: 16px;
                  stroke: rgba($white, 0.7);
                }
                
                .filter-text {
                  font-size: 0.9rem;
                  font-weight: $font-weight-regular;
                  color: $white;
                }
              }
              
              .dropdown-arrow {
                width: 16px;
                height: 16px;
                stroke: rgba($white, 0.5);
                transition: transform 0.2s ease;
                
                &.active {
                  transform: rotate(180deg);
                }
              }
            }
            
            .filter-dropdown-menu {
              position: absolute;
              top: calc(100% + 0.5rem);
              right: 0;
              background: rgba(#1a1a1a, 0.95);
              backdrop-filter: blur(10px);
              border: 1px solid rgba($white, 0.1);
              border-radius: 12px;
              padding: 0;
              min-width: 200px;
              z-index: 1000;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
              
              .dropdown-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.25rem;
                border-bottom: 1px solid rgba($white, 0.1);
                
                h4 {
                  font-size: 0.9rem;
                  font-weight: $font-weight-semi-bold;
                  font-family: $font-family-primary-medium;
                  color: $white;
                  margin: 0;
                }
                
                .close-dropdown-btn {
                  background: none;
                  border: none;
                  color: rgba($white, 0.6);
                  cursor: pointer;
                  padding: 0.25rem;
                  border-radius: 4px;
                  transition: all 0.2s ease;
                  
                  &:hover {
                    background: rgba($white, 0.1);
                    color: $white;
                  }
                  
                  svg {
                    width: 16px;
                    height: 16px;
                  }
                }
              }
              
              .dropdown-options {
                padding: 0.5rem 0;
                
                .dropdown-option {
                  width: 100%;
                  background: none;
                  border: none;
                  padding: 0.75rem 1.25rem;
                  color: rgba($white, 0.8);
                  font-family: $font-family-primary-regular;
                  font-size: 0.9rem;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  transition: all 0.2s ease;
                  
                  &:hover {
                    background: rgba($white, 0.05);
                    color: $white;
                  }
                  
                  &.selected {
                    background: rgba($orange, 0.1);
                    color: $orange;
                    
                    .check-icon {
                      stroke: $orange;
                    }
                  }
                  
                  .check-icon {
                    width: 16px;
                    height: 16px;
                    stroke: $orange;
                  }
                }
              }
            }
          }
        }
      }

      // Quiz Grid
      .quiz-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;

        .quiz-card {
          background: rgba($white, 0.03);
          border-radius: 16px;
          border: 1px solid rgba($white, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            background: rgba($white, 0.06);
          }

          &.active {
            border-color: rgba($orange, 0.5);
          }

          &.draft {
            border-color: rgba($yellow, 0.3);
            opacity: 0.8;
          }

          .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: rgba($white, 0.02);
            border-bottom: 1px solid rgba($white, 0.05);

            .quiz-status {
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: $font-weight-semi-bold;
              font-family: $font-family-primary-medium;

              &.active {
                background: rgba($orange, 0.2);
                color: $orange;
              }

              &.draft {
                background: rgba($yellow, 0.2);
                color: $yellow;
              }

              &.completed {
                background: rgba(#10b981, 0.2);
                color: #10b981;
              }
            }

            .quiz-actions {
              display: flex;
              gap: 0.5rem;

              .action-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 8px;
                background: rgba($white, 0.1);
                color: rgba($white, 0.7);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;

                svg {
                  width: 16px;
                  height: 16px;
                }

                &:hover {
                  background: rgba($white, 0.15);
                  color: $white;
                }

                &.edit:hover {
                  background: rgba($orange, 0.2);
                  color: $orange;
                }

                &.delete:hover {
                  background: rgba(#ef4444, 0.2);
                  color: #ef4444;
                }
              }
            }
          }

          .quiz-content-card {
            padding: 1.5rem;

            .quiz-title {
              font-size: 1.25rem;
              font-weight: $font-weight-bold;
              font-family: $font-family-primary-bold;
              color: $white;
              margin: 0 0 0.5rem 0;
              line-height: 1.3;
            }

            .quiz-description {
              font-size: 0.9rem;
              font-family: $font-family-primary-regular;
              color: rgba($white, 0.7);
              margin: 0 0 1rem 0;
              line-height: 1.4;
            }

            .quiz-meta {
              display: flex;
              gap: 1rem;
              margin-bottom: 1rem;
              flex-wrap: wrap;

              .meta-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.85rem;
                font-family: $font-family-primary-regular;
                color: rgba($white, 0.6);

                svg {
                  width: 16px;
                  height: 16px;
                  stroke: rgba($white, 0.5);
                }
              }
            }

            .quiz-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 1rem;
              border-top: 1px solid rgba($white, 0.05);

              .quiz-date {
                font-size: 0.8rem;
                font-family: $font-family-primary-regular;
                color: rgba($white, 0.5);
              }

              .quiz-score {
                font-size: 0.85rem;
                font-weight: $font-weight-semi-bold;
                font-family: $font-family-primary-medium;
                color: $orange;
              }
            }
          }
        }
      }

      // Empty State
      .empty-state {
        text-align: center;
        padding: 3rem 1.5rem;
        background: rgba($white, 0.02);
        border-radius: 16px;
        border: 2px dashed rgba($white, 0.1);

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          opacity: 0.3;

          svg {
            width: 100%;
            height: 100%;
            stroke: $orange;
          }
        }

        h3 {
          font-size: 1.5rem;
          font-weight: $font-weight-bold;
          font-family: $font-family-primary-bold;
          color: $white;
          margin: 0 0 0.5rem 0;
        }

        p {
          font-size: 1rem;
          font-family: $font-family-primary-regular;
          color: rgba($white, 0.6);
          margin: 0;
        }
      }
    }
  }

  // Action Button Section - Bottom
  .action-section-bottom {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    padding: 1.5rem;

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: $font-weight-semi-bold;
      font-family: $font-family-primary-medium;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;

      &.btn-transparent {
        background: transparent;
        color: rgba($white, 0.7);
        border: 2px solid rgba($white, 0.2);

        &:hover {
          background: rgba($white, 0.05);
          color: $white;
          border-color: rgba($white, 0.4);
          transform: translateY(-2px);
        }
      }

      svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .teacher-quiz {
    .welcome-section {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;

      .welcome-actions {
        align-self: flex-start;
      }
    }

    .quiz-content {
      .quiz-stats {
        grid-template-columns: 1fr;
      }

      .quiz-list-section {
        .quiz-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
      }
    }

    .action-section-bottom {
      padding: 1rem;

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>