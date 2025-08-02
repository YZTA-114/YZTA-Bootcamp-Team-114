<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #sidebar-classroom-dropdown>
      <ClassroomDropdown />
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="student-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Hoşgeldin {{ user?.userProfile?.firstName || 'Öğrenci' }}</h1>
            <p class="welcome-subtitle" v-if="hasClassrooms">Bugün derslerinde neler var.</p>
            <p class="welcome-subtitle" v-else>Henüz bir sınıfa kayıtlı değilsiniz.</p>
            <div class="motivation-quote" v-if="hasClassrooms">"Başarı, azimle çalışanların olur."</div>
            <div class="motivation-quote" v-else>"Öğrenme yolculuğuna başlamak için bir sınıfa katılın."</div>
          </div>
          <div class="welcome-actions">
            <button v-if="hasClassrooms" class="btn btn-primary" @click="goToCourses">
              <ri-book-line />
              Dersleri Görüntüle
            </button>
            <button v-else class="btn btn-primary" @click="joinNewClass">
              <ri-add-line />
              Sınıfa Katıl
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div v-if="currentClassroom" class="stats-gradient-box" style="border: 2px solid rgba(136, 136, 136, 0.5);">
          <!-- Existing stats content -->
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-orange"><ri-check-line /></div>
              <div class="stat-title">Kayıtlı Dersler</div>
            </div>
            <div class="stat-score"><span>{{ stats.enrolledCourses }}</span><span class="stat-outof">/20</span></div>
            <div class="stat-percent">100%</div>
            <div class="stat-desc">Harika! Tüm derslere kayıtlısın, devam et!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-pink"><ri-time-line /></div>
              <div class="stat-title">Bekleyen Quizler</div>
            </div>
            <div class="stat-score"><span>{{ stats.pendingAssignments }}</span><span class="stat-outof">/10</span></div>
            <div class="stat-percent">60%</div>
            <div class="stat-desc">Quizlerini zamanında tamamlamayı unutma!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-yellow"><ri-bar-chart-line /></div>
              <div class="stat-title">Başarı Oranı</div>
            </div>
            <div class="stat-score"><span>{{ stats.averageGrade }}</span><span class="stat-outof">%</span></div>
            <div class="stat-percent">{{ stats.averageGrade }}%</div>
            <div class="stat-desc">Başarın çok iyi, böyle devam et!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-green"><ri-graduation-cap-line /></div>
              <div class="stat-title">Tamamlanan Dersler</div>
            </div>
            <div class="stat-score"><span>{{ stats.completedCourses }}</span><span class="stat-outof">/20</span></div>
            <div class="stat-percent">80%</div>
            <div class="stat-desc">Birçok dersi tamamladın, gurur duyabilirsin!</div>
          </div>
        </div>
        <div v-else class="no-classroom-box">
          <div class="no-classroom-icon">
            <ri-group-line />
          </div>
          <h2 class="no-classroom-title">Henüz Bir Sınıfa Kayıtlı Değilsiniz</h2>
          <p class="no-classroom-desc">
            Öğrenme yolculuğunuza başlamak için bir sınıfa katılın. 
            Sınıfa katıldıktan sonra derslerinizi görüntüleyebilir, 
            quizleri çözebilir ve başarılarınızı takip edebilirsiniz.
          </p>
          <button class="btn btn-primary join-class-btn-large" @click="joinNewClass">
            <ri-add-line />
            Yeni Sınıfa Katıl
          </button>
        </div>

        <!-- Events and Solved Quizzes -->
        <div v-if="currentClassroom" class="events-and-solved-container">
          <!-- Upcoming Events -->
          <div class="upcoming-events-card" style="border: 2px solid rgba(136, 136, 136, 0.5);">
            <h2 class="events-title">Yaklaşan Quizler</h2>
            <div class="events-list">
              <div class="event-item">
                <div class="event-status-badge">Bugün</div>
                <div class="event-date-box">
                  <span class="event-day-num">6</span>
                  <span class="event-month">Şub</span>
                </div>
                <div class="event-content">
                  <h3 class="event-title">Matematik Quiz 1</h3>
                  <div class="event-course">Ders: Matematik</div>
                  <div class="event-time">
                    <ri-time-line />
                    Süre: 20 dk
                  </div>
                  <div class="event-actions">
                    <button class="event-solve-btn">Çöz</button>
                  </div>
                </div>
              </div>
              
              <div class="event-item">
                <div class="event-status-badge">3 gün sonra</div>
                <div class="event-date-box">
                  <span class="event-day-num">9</span>
                  <span class="event-month">Şub</span>
                </div>
                <div class="event-content">
                  <h3 class="event-title">Tarih Quiz 1</h3>
                  <div class="event-course">Ders: Tarih</div>
                  <div class="event-time">
                    <ri-time-line />
                    Süre: 10 dk
                  </div>
                  <div class="event-actions">
                    <button class="event-solve-btn">Çöz</button>
                  </div>
                </div>
              </div>
              
              <div class="event-item">
                <div class="event-status-badge">3 gün sonra</div>
                <div class="event-date-box">
                  <span class="event-day-num">9</span>
                  <span class="event-month">Şub</span>
                </div>
                <div class="event-content">
                  <h3 class="event-title">Fizik Quiz 2</h3>
                  <div class="event-course">Ders: Fizik</div>
                  <div class="event-time">
                    <ri-time-line />
                    Süre: 15 dk
                  </div>
                  <div class="event-actions">
                    <button class="event-solve-btn">Çöz</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="events-footer">
              <button class="view-more-btn">
                Daha Fazla Gör
                <ri-arrow-down-s-line />
              </button>
            </div>
          </div>

          <!-- Solved Quizzes Table -->
          <div class="solved-quizzes-card" style="border: 2px solid rgba(136, 136, 136, 0.5);">
            <h2 class="solved-title">Sonuçlarım</h2>
            <div class="solved-list-table">
              <div class="solved-list-header">
                <div class="solved-col">DERS ADI</div>
                <div class="solved-col">SÜRE (dk)</div>
                <div class="solved-col">Doğru</div>
                <div class="solved-col">Yanlış</div>
                <div class="solved-col">Puan</div>
                <div class="solved-col"></div>
              </div>
              <div
                class="solved-list-row"
                v-for="item in pagedSolvedList"
                :key="item.id"
              >
                <div class="solved-col">{{ item.course }}</div>
                <div class="solved-col">{{ item.duration }}</div>
                <div class="solved-col">{{ item.correct }}</div>
                <div class="solved-col">{{ item.total - item.correct }}</div>
                <div class="solved-col"
                  :class="{
                    'high-score': Math.round((item.correct / item.total) * 100) >= 85,
                    'mid-score': Math.round((item.correct / item.total) * 100) >= 60 && Math.round((item.correct / item.total) * 100) < 85,
                    'low-score': Math.round((item.correct / item.total) * 100) < 60
                  }"
                >
                  {{ Math.round((item.correct / item.total) * 100) }}
                </div>
                <div class="solved-col" style="display: flex; justify-content: flex-end; gap: 8px;">
                  <div class="report-icon-wrapper" @click="showReport(item)">
                    <svg class="report-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20" fill="none">
                      <rect x="8" y="8" width="48" height="48" rx="6" stroke="#666" stroke-width="4" fill="none"/>
                      <polyline points="18,44 28,32 38,38 46,22" fill="none" stroke="#666" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="18" cy="44" r="3" fill="#666"/>
                      <circle cx="28" cy="32" r="3" fill="#666"/>
                      <circle cx="38" cy="38" r="3" fill="#666"/>
                      <circle cx="46" cy="22" r="3" fill="#666"/>
                      <polyline points="40,8 56,8 56,24" fill="none" stroke="#666" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="report-tooltip">Raporu görüntüle</div>
                  </div>
                  <div class="delete-icon-wrapper" @click="deleteSolvedItem(item)">
                    <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <rect x="3" y="6" width="18" height="15" rx="2" stroke="#999" stroke-width="2" fill="none"/>
                      <path d="M8 10v6M12 10v6M16 10v6" stroke="#999" stroke-width="2" stroke-linecap="round"/>
                      <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" stroke="#999" stroke-width="2"/>
                    </svg>
                    <div class="delete-tooltip">Sil</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Recent Activity & Upcoming Deadlines -->
        <div v-if="hasClassrooms" class="dashboard-grid">
        </div>
      </div>
    </template>
  </DashboardLayout>
  
  <!-- Custom Confirm Modal -->
  <ConfirmModal
    :is-visible="showDeleteModal"
    title="Rapor Silme"
    :message="deleteModalMessage"
    confirm-text="Sil"
    cancel-text="İptal"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    @close="cancelDelete"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import ConfirmModal from '@/components/custom/ConfirmModal.vue'
import ClassroomDropdown from '@/components/dashboard/ClassroomDropdown.vue'
import { useStore } from 'vuex'
import { useNavigation } from '@/composables/useNavigation'

const store = useStore()

// Router
const router = useRouter();

const user = computed(() => store.getters['auth/getUser'])
const currentClassroom = computed(() => store.getters['classroom/getCurrentClassroom'])

// User data
const userRole = computed(() => user.value?.role || 'student')
const { navItems, isSidebarCollapsed } = useNavigation(userRole)
const currentPage = ref('Dashboard')
const notificationCount = ref(3)

// Modal state
const showDeleteModal = ref(false)
const deleteModalMessage = ref('')
const itemToDelete = ref(null)

// Stats
const stats = ref({
  enrolledCourses: 5,
  pendingAssignments: 8,
  averageGrade: 87,
  completedCourses: 12
})

// Navigation items
// Remove the old navItems definition since we're using the shared one

// Classroom data from store
const classrooms = computed(() => store.getters['classroom/getUserClassrooms'])
const hasClassrooms = computed(() => classrooms.value && classrooms.value.length > 0)

// Methods
const handleLogout = () => {
  // Handle logout logic
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/student/profile')
}

const handleSettings = () => {
  router.push('/student/settings')
}

const goToCourses = () => {
  router.push('/student/courses')
}

// Sonuçlarım verisi
const solvedList = ref([
  { id: 1, course: 'Matematik', duration: 18, correct: 8, total: 10 },
  { id: 2, course: 'Fizik', duration: 15, correct: 7, total: 10 },
  { id: 3, course: 'Kimya', duration: 20, correct: 9, total: 10 },
  { id: 4, course: 'Biyoloji', duration: 17, correct: 6, total: 10 },
  { id: 5, course: 'Tarih', duration: 14, correct: 10, total: 10 },
  { id: 6, course: 'Coğrafya', duration: 19, correct: 9, total: 10 },
  { id: 7, course: 'Edebiyat', duration: 16, correct: 7, total: 10 },
  { id: 8, course: 'Felsefe', duration: 13, correct: 8, total: 10 },
  { id: 9, course: 'Geometri', duration: 21, correct: 10, total: 10 },
  { id: 10, course: 'Almanca', duration: 12, correct: 6, total: 10 },
  { id: 11, course: 'İngilizce', duration: 15, correct: 9, total: 10 },
  { id: 12, course: 'Fransızca', duration: 18, correct: 8, total: 10 }
])

const pagedSolvedList = computed(() => {
  // Sadece son 5 sonuç göster
  return solvedList.value.slice(-5)
})

function showReport(item) {
  alert(item.course + ' dersi için rapor sayfasına yönlendirilecek!')
}

function deleteSolvedItem(item) {
  itemToDelete.value = item
  deleteModalMessage.value = `"${item.course}" dersi quiz sonucunu silmek istediğinize emin misiniz?`
  showDeleteModal.value = true
}

function confirmDelete() {
  if (itemToDelete.value) {
    const index = solvedList.value.findIndex(solved => solved.id === itemToDelete.value.id)
    if (index > -1) {
      solvedList.value.splice(index, 1)
      // Başarı mesajı için toast veya notification kullanılabilir
      console.log(`${itemToDelete.value.course} dersi kaydı başarıyla silindi!`)
    }
  }
  cancelDelete()
}

function cancelDelete() {
  showDeleteModal.value = false
  deleteModalMessage.value = ''
  itemToDelete.value = null
}

// Lifecycle
onMounted(() => {
  // Fetch user data and stats
  console.log('Student dashboard mounted')
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';
// KOYU TEMA OVERRIDES
body, .student-dashboard, .welcome-section, .stats-gradient-box, .dashboard-card, .solved-quizzes-card, .upcoming-events-card, .solved-list-table, .quiz-item, .event-item {
  background: #000 !important;
  color: #fff !important;
}

.welcome-section {
  background: #e67e22 !important;
  color: #fff !important;
}

.welcome-title, .welcome-subtitle, .motivation-quote {
  color: #fff !important;
}

.stats-gradient-box, .solved-quizzes-card, .upcoming-events-card {
  background: #111 !important;
  color: #fff !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3) !important;
}

.stat-title, .stat-score, .stat-desc, .stat-percent, .stat-outof {
  color: #fff !important;
}

.dashboard-card, .quiz-card, .solved-card {
  background: #111 !important;
  color: #fff !important;
}

.card-title, .events-title, .solved-title {
  color: #fff !important;
}

.solved-list-table, .solved-list-header, .solved-list-row {
  background: #111 !important;
  color: #fff !important;
}
.solved-list-header, .solved-list-row {
  border-bottom: 1.5px solid #888 !important;
}
.solved-list-header .solved-col, .solved-list-row .solved-col {
  color: #fff !important;
}
.solved-list-row:hover {
  background: #181818 !important;
}

.quiz-item, .event-item {
  background: #181818 !important;
  color: #fff !important;
  border: 1px solid #222 !important;
}

.quiz-row, .event-title, .event-course, .event-time, .event-day, .event-month, .event-day-num {
  color: #fff !important;
}

.btn, .btn-primary, .btn-solve, .event-solve-btn, .view-more-btn {
  background: #e67e22 !important;
  color: #fff !important;
  border: none !important;
}
.btn:hover, .btn-primary:hover, .btn-solve:hover, .event-solve-btn:hover, .view-more-btn:hover {
  background: #ca6f1e !important;
  color: #fff !important;
}

.student-dashboard {
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  .welcome-section {
    background: $orange;
    color: $white;
    padding: $space-s $space-m;
    border-radius: 8px;
    margin-bottom: $space-l;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .welcome-content {
      .welcome-title {
        font-size: $font-size-l;
        font-weight: $font-weight-bold;
        margin: 0 0 $space-xs 0;
      }
      .welcome-subtitle {
        font-size: $font-size-s;
        opacity: 0.9;
        margin: 0 0 2px 0;
      }
      .motivation-quote {
        font-size: $font-size-xs;
        opacity: 0.85;
        margin-top: 2px;
        font-style: italic;
        color: $white;
      }
    }

    .welcome-actions {
      .btn {
        background-color: rgba(255,255,255,0.18) !important;
        border: 1.5px solid rgba(255,255,255,0.28) !important;
        color: #fff !important;
        padding: $space-s $space-l;
        border-radius: 8px;
        font-weight: $font-weight-semi-bold;
        font-family: $font-family-primary-medium;
        transition: all 0.2s ease;
        &:hover {
          background-color: rgba(255,255,255,0.28) !important;
          color: #fff !important;
          transform: translateY(-2px);
        }
        i {
          margin-right: $space-xs;
        }
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $space-m;
    margin-bottom: $space-l;

    .stat-card {
      background-color: $white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba($black, 0.10);
      min-height: 120px;
      position: relative;
      padding: 24px 18px 18px 18px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      overflow: visible;
      transition: box-shadow 0.2s;
      &:hover {
        box-shadow: 0 4px 16px rgba($black, 0.14);
      }
      .stat-icon-box {
        position: absolute;
        top: -22px;
        left: 18px;
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.1rem;
        color: #fff;
        box-shadow: 0 2px 8px rgba($black, 0.10);
        z-index: 2;
      }
      .stat-orange {
        background: linear-gradient(135deg, $orange, #ffe0b2);
        }
      .stat-pink {
        background: linear-gradient(135deg, $pink, #f8bbd0);
        }
      .stat-yellow {
        background: linear-gradient(135deg, $yellow, #fff9c4);
        color: #222;
        }
      .stat-green {
        background: linear-gradient(135deg, #28a745, #b9f6ca);
        }
      .stat-main {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: 100%;
        margin-top: 18px;
        }
        .stat-label {
        font-size: 1.08rem;
        color: #222;
        font-weight: 500;
        margin-bottom: 2px;
        text-align: right;
      }
      .stat-number {
        font-size: 2.2rem;
        font-weight: 700;
        color: #222;
        line-height: 1.1;
        margin-bottom: 2px;
        text-align: right;
      }
      .stat-desc {
        font-size: 0.98rem;
        color: #b0b0b0;
        font-weight: 400;
        margin-top: 4px;
        text-align: right;
      }
    }
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-l;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .dashboard-card {
    background: none;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;

    .card-header {
      padding: $space-l 0 $space-l 0;
      border-bottom: none;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: $font-size-l;
        font-weight: $font-weight-semi-bold;
        margin: 0;
        color: $black;
      }

      .btn-text {
        background: none;
        border: none;
        color: $pink;
        font-size: $font-size-s;
        font-weight: $font-weight-semi-bold;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: darken($pink, 10%);
        }
      }
    }

    .card-content {
      padding: $space-l;
    }
  }

  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      gap: $space-m;
      padding: $space-s 0;
      border-bottom: 1px solid rgba($black, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-s;
        color: $white;

        &.assignment {
          background-color: $orange;
        }

        &.grade {
          background-color: $yellow;
        }

        &.course {
          background-color: $pink;
        }

        &.announcement {
          background-color: #28a745;
        }
      }

      .activity-content {
        flex: 1;

        .activity-text {
          font-size: $font-size-s;
          margin: 0 0 $space-xs 0;
          color: $black;
        }

        .activity-time {
          font-size: $font-size-xs;
          color: rgba($black, 0.6);
        }
      }
    }
  }

  .deadline-list {
    .deadline-item {
      display: flex;
      align-items: center;
      gap: $space-m;
      padding: $space-s 0;
      border-bottom: 1px solid rgba($black, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .deadline-date {
        text-align: center;
        min-width: 60px;

        .deadline-day {
          display: block;
          font-size: $font-size-l;
          font-weight: $font-weight-bold;
          color: $pink;
        }

        .deadline-month {
          display: block;
          font-size: $font-size-xs;
          color: rgba($black, 0.6);
          text-transform: uppercase;
        }
      }

      .deadline-content {
        flex: 1;

        .deadline-title {
          font-size: $font-size-s;
          font-weight: $font-weight-semi-bold;
          margin: 0 0 $space-xs 0;
          color: $black;
        }

        .deadline-course {
          font-size: $font-size-xs;
          color: rgba($black, 0.7);
          margin: 0 0 $space-xs 0;
        }

        .deadline-time {
          font-size: $font-size-xs;
          color: $orange;
          font-weight: $font-weight-semi-bold;
        }
      }

      .deadline-actions {
        .btn-sm {
          padding: $space-xs $space-s;
          font-size: $font-size-xs;
          border-radius: 6px;
        }
      }
    }
  }
}

.quiz-card .card-header {
  align-items: flex-start;
}
.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.quiz-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
}
.quiz-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.quiz-row {
  font-size: $font-size-s;
  color: $black;
}
.quiz-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.btn-danger {
  background: $pink;
  color: $white;
  border: none;
  &:hover {
    background: darken($pink, 10%);
  }
}

// Button styles
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  padding: $space-s $space-m;
  border: none;
  border-radius: 8px;
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &.btn-primary {
    background-color: $pink;
    color: $white;

    &:hover {
      background-color: darken($pink, 10%);
    }
  }

  &.btn-outline {
    background-color: transparent;
    border: 1px solid rgba($black, 0.2);
    color: $black;

    &:hover {
      background-color: rgba($black, 0.05);
    }
  }

  &.btn-sm {
    padding: $space-xs $space-s;
    font-size: $font-size-xs;
  }
}
.btn-solve {
  background: #fff;
  color: $pink;
  border: 2px solid $pink;
  font-weight: $font-weight-semi-bold;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.btn-solve:hover {
  background: rgba($pink, 0.08);
  color: $pink;
}

// Sidebar classroom listesi için stil
.sidebar-classrooms {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 16px;
}
.sidebar-classroom {
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  color: $yellow;
  background: rgba($yellow, 0.08);
  border-radius: 6px;
  padding: 6px 12px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-classroom.big {
  font-size: 1.3rem;
  font-weight: bold;
  background: #f5f5f5;
  color: #222;
  padding: 18px 24px;
  border-radius: 10px;
  margin-bottom: 18px;
  width: 90%; // veya 100% ya da istediğin kadar
  min-width: 200px;
  text-align: center;
}

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
      border: 1.5px solid #888;
      box-shadow: 0 1px 4px rgba(136, 136, 136, 0.1);
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
      border: 1.5px solid #888;
      animation: fadeIn 0.18s;
    }
    .dropdown-header {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      padding: 14px 18px 6px 18px;
      border-bottom: 1px solid rgba(136, 136, 136, 0.1);
      background: #232323;
    }
    .dropdown-search-wrapper {
      padding: 8px 18px 0 18px;
    }
    .dropdown-search {
      width: 100%;
      padding: 7px 12px;
      border-radius: 7px;
      border: 1.2px solid rgba(136, 136, 136, 0.3);
      background: #232323;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
    }
    .dropdown-search:focus {
      border: 1.2px solid rgba(136, 136, 136, 0.5);
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
      border-top: 1px solid rgba(136, 136, 136, 0.1);
      margin-top: 4px;
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
.myquiz-bottom-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.solved-card {
  .card-content {
    padding-bottom: 0;
    min-height: 260px;
  }
  min-height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: span 2;
}
.solved-list-table {
  width: 100%;
  background: $white;
  overflow: visible;
  font-size: $font-size-s;
  margin-bottom: 18px;

  .solved-list-header {
    display: flex;
    color: $black;
    font-weight: $font-weight-bold;
    border-bottom: 1px solid #eee;
    padding: 10px 0 10px 0;
    background: #f5f6fa; // Açık gri header arka planı
    .solved-col {
      flex: 1 1 0;
      text-align: left;
      padding: 0 12px;
      font-size: $font-size-xs;
      letter-spacing: 0.5px;
      &:last-child {
        text-align: right;
      }
    }
  }

  .solved-list-row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 0 12px 0;
    transition: background 0.18s;
    background: #fff;
    &:nth-child(even) {
      background: #fafbfc; // Zebra satır
    }
    &:hover {
      background: #fce4ec; // Hafif pembe hover (isteğe göre değiştirilebilir)
    }
    .solved-col {
      flex: 1 1 0;
      text-align: left;
      padding: 0 12px;
      font-size: $font-size-s;
      color: $black;
      background: none;
      &:last-child {
        text-align: right;
        .report-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .report-icon-wrapper:hover {
          background: transparent;
          .report-tooltip {
            opacity: 1;
            pointer-events: auto;
          }
        }
        .report-icon {
          display: block;
          margin: auto;
        }
        .report-tooltip {
          position: absolute;
          left: 50%;
          top: 110%;
          transform: translateX(-50%);
          background: $black;
          color: $white;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: $font-size-xs;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          z-index: 20;
        }
      }
      // Puan hücresine renkli vurgu
      &:nth-child(5) {
        font-weight: bold;
        color: #222;
      }
    }
  }

}
.delete-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}
.delete-icon-wrapper:hover {
  background: rgba(211, 47, 47, 0.08);
  .delete-tooltip {
    opacity: 1;
    pointer-events: auto;
  }
}
.delete-icon {
  display: block;
  margin: auto;
}
.delete-tooltip {
  position: absolute;
  left: 50%;
  top: 110%;
  transform: translateX(-50%);
  background: #d32f2f;
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 20;
}

// SCSS: stats-gradient-box, stat-col, stat-title, stat-icon-score, stat-bigicon, stat-score, stat-outof, stat-percent, stat-desc, stat-divider
.stats-gradient-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background: $white;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba($black, 0.10);
  padding: $space-m $space-l;
  margin-bottom: $space-l;
  min-height: 160px;
  overflow: hidden;
}
.stat-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 $space-m;
  min-width: 0;
  text-align: center;
}
.stat-header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  width: 100%;
  margin-bottom: $space-xs;
}
.stat-title {
  color: #222;
  font-size: $font-size-m;
  font-weight: 600;
  text-align: left;
  margin-bottom: 0;
}
.stat-icon-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: $space-xs;
}
.stat-bigicon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0;
}
.stat-orange,
.stat-pink,
.stat-yellow,
.stat-green {
  background: linear-gradient(135deg, $pink, darken($pink, 10%));
  color: #fff;
}
.stat-score {
  color: #222;
  font-size: $font-size-xl;
  font-weight: 700;
  margin-bottom: 2px;
  text-align: center;
}
.stat-outof {
  font-size: $font-size-s;
  font-weight: 400;
  opacity: 0.8;
  margin-left: 2px;
  color: #222;
}
.stat-percent {
  background: rgba(0,0,0,0.08);
  color: #222;
  font-size: $font-size-xs;
  font-weight: 600;
  border-radius: 12px;
  padding: 2px 12px;
  margin-bottom: 2px;
  margin-top: 2px;
  display: inline-block;
}
.stat-desc {
  color: #222;
  font-size: $font-size-xs;
  text-align: center;
  margin-top: 2px;
  font-weight: 400;
}
.stat-divider {
  width: 1px;
  background: #222;
  margin: 0 $space-xs;
  border-radius: 2px;
}

// SCSS: events-and-solved-container ve ilgili sınıfları ekle
.events-and-solved-container {
  display: flex;
  gap: $space-l;
  margin-bottom: $space-l;
  align-items: flex-start;
}

.upcoming-events-card {
  background: $white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba($black, 0.08);
  padding: $space-l;
  flex: 0 0 400px;
}
.events-title {
  font-size: $font-size-l;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin: 0 0 $space-m 0;
}
.events-list {
  display: flex;
  flex-direction: column;
  gap: $space-m;
  margin-bottom: $space-l;
}
.event-item {
  background: #f5f5f5;
  border-radius: 10px;
  padding: $space-s;
  position: relative;
  box-shadow: 0 2px 8px rgba($black, 0.04);
  display: flex;
  align-items: flex-start;
  gap: $space-s;
  min-height: 70px;
}
.event-status-badge {
  position: absolute;
  top: $space-s;
  right: 50px;
  background: #ffe6e6;
  color: #d32f2f;
  font-size: $font-size-xs;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}
.event-day {
  position: absolute;
  top: $space-s;
  left: $space-s;
  font-size: $font-size-xs;
  color: #666;
  font-weight: 500;
}
.event-date-box {
  width: 40px;
  height: 40px;
  background: $orange;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 12px;
}
.event-day-num {
  font-size: $font-size-m;
  font-weight: 700;
  color: #222;
  line-height: 1;
}
.event-month {
  font-size: $font-size-xs;
  font-weight: 600;
  color: #222;
  margin-top: 2px;
}
.event-content {
  flex: 1;
  margin-top: 12px;
}
.event-title {
  font-size: $font-size-s;
  font-weight: 600;
  color: #222;
  margin: 0 0 2px 0;
  line-height: 1.2;
}
.event-course {
  font-size: $font-size-xs;
  color: #666;
  font-weight: 500;
  margin-bottom: 2px;
}
.event-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-xs;
  color: #666;
  font-weight: 500;
}
.event-time i {
  font-size: $font-size-xs;
  color: #666;
}
.event-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
  position: absolute;
  bottom: $space-s;
  right: $space-s;
}
.event-solve-btn {
  background: $white;
  color: $pink;
  border: 1px solid $pink;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: $font-size-xs;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 32px;
  text-align: center;
}
.event-solve-btn:hover {
  background: rgba($pink, 0.08);
  color: $pink;
}
.events-footer {
  display: flex;
  justify-content: center;
}
.view-more-btn {
  background: none;
  border: none;
  color: #2196f3;
  font-size: $font-size-s;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: $space-xs $space-s;
  border-radius: 6px;
  transition: background 0.2s;
}
.view-more-btn:hover {
  background: rgba(33, 150, 243, 0.08);
}
.view-more-btn i {
  font-size: $font-size-xs;
}

// Solved quizzes card styles
.solved-quizzes-card {
  background: $white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba($black, 0.08);
  padding: $space-l;
  flex: 1;
}

.solved-title {
  font-size: $font-size-l;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin: 0 0 $space-m 0;
}
.upcoming-events-card .event-item {
  color: #fff !important;
  border: 2px solid #888 !important;
}
.upcoming-events-card .event-title,
.upcoming-events-card .event-course,
.upcoming-events-card .event-time,
.upcoming-events-card .event-day,
.upcoming-events-card .event-month,
.upcoming-events-card .event-day-num {
  color: #fff !important;
}
.upcoming-events-card .event-status-badge {
  font-weight: 700;
  color: #d32f2f !important;
  background: #ffe6e6 !important;
}
.upcoming-events-card .event-solve-btn {
  background: rgba(136, 136, 136, 0.18) !important;
  color: #888 !important;
  border: 1.5px solid rgba(136, 136, 136, 0.28) !important;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}
.upcoming-events-card .event-solve-btn:hover {
  background: rgba(136, 136, 136, 0.28) !important;
  color: #fff !important;
}

.dropdown-selected-title.no-classroom {
  color: #888;
  font-style: italic;
}

.no-classroom-message {
  padding: 24px 18px;
  text-align: center;
  color: #888;
  font-size: $font-size-s;
  line-height: 1.4;
}

.no-classroom-box {
  background: #111;
  border: 2px solid rgba(136, 136, 136, 0.5);
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
  margin-bottom: $space-l;
  
  .no-classroom-icon {
    font-size: 64px;
    color: #888;
    margin-bottom: 24px;
    
    i {
      opacity: 0.8;
    }
  }
  
  .no-classroom-title {
    font-size: $font-size-l;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
  }
  
  .no-classroom-desc {
    font-size: $font-size-m;
    color: #888;
    max-width: 600px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }
  
  .join-class-btn-large {
    font-size: $font-size-m;
    padding: 12px 32px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    
    i {
      font-size: $font-size-l;
    }
    
    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style> 