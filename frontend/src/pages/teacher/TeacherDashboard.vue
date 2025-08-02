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
      <div class="teacher-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Hoşgeldin {{ userName }}</h1>
            <p class="welcome-subtitle">Bugün öğretmenlik görevlerin neler.</p>
            <div class="motivation-quote">"Eğitim, geleceği şekillendiren en güçlü araçtır."</div>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-primary" @click="goToCourses">
              <ri-book-line />
              Dersleri Yönet
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-gradient-box" style="border: 2px solid rgba(211, 211, 211, 0.5);">
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-orange"><ri-book-line /></div>
              <div class="stat-title">Aktif Dersler</div>
            </div>
            <div class="stat-score"><span>{{ stats.activeCourses }}</span><span class="stat-outof">/10</span></div>
            <div class="stat-percent">100%</div>
            <div class="stat-desc">Harika! Tüm derslerin aktif, devam et!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-pink"><ri-group-line /></div>
              <div class="stat-title">Toplam Öğrenci</div>
            </div>
            <div class="stat-score"><span>{{ stats.totalStudents }}</span><span class="stat-outof">/200</span></div>
            <div class="stat-percent">85%</div>
            <div class="stat-desc">Öğrenci sayın çok iyi, böyle devam et!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-yellow"><ri-file-text-line /></div>
              <div class="stat-title">Bekleyen Ödevler</div>
            </div>
            <div class="stat-score"><span>{{ stats.pendingSubmissions }}</span><span class="stat-outof">/50</span></div>
            <div class="stat-percent">60%</div>
            <div class="stat-desc">Ödevleri zamanında değerlendirmeyi unutma!</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-green"><ri-star-line /></div>
              <div class="stat-title">Ortalama Puan</div>
            </div>
            <div class="stat-score"><span>{{ stats.averageRating }}</span><span class="stat-outof">/5</span></div>
            <div class="stat-percent">{{ stats.averageRating * 20 }}%</div>
            <div class="stat-desc">Öğrencilerinden çok yüksek puan alıyorsun!</div>
          </div>
        </div>

        <!-- Upcoming Classes and Recent Submissions -->
        <div class="events-and-solved-container">
          <!-- Upcoming Classes -->
          <div class="upcoming-events-card" style="border: 2px solid rgba(211, 211, 211, 0.5);">
            <h2 class="events-title">Bugünkü Dersler</h2>
            <div class="events-list">
              <div 
                v-for="classItem in todaysClasses" 
                :key="classItem.id" 
                class="event-item"
              >
                <div class="event-status-badge">{{ classItem.time }}</div>
                <div class="event-date-box">
                  <span class="event-day-num">{{ classItem.studentCount }}</span>
                  <span class="event-month">Öğr</span>
                </div>
                <div class="event-content">
                  <h3 class="event-title">{{ classItem.title }}</h3>
                  <div class="event-course">Ders: {{ classItem.courseName }}</div>
                  <div class="event-time">
                    <ri-time-line />
                    Süre: {{ classItem.duration }}
                  </div>
                  <div class="event-actions">
                    <button class="event-solve-btn" @click="startClass(classItem)">Başlat</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="events-footer">
              <button class="view-more-btn" @click="viewAllClasses">
                Daha Fazla Gör
                <ri-arrow-down-s-line />
              </button>
            </div>
          </div>

          <!-- Recent Submissions Table -->
          <div class="solved-quizzes-card" style="border: 2px solid rgba(211, 211, 211, 0.5);">
            <h2 class="solved-title">Son Ödevler</h2>
            <div class="solved-list-table">
              <div class="solved-list-header">
                <div class="solved-col">ÖĞRENCİ</div>
                <div class="solved-col">DERS</div>
                <div class="solved-col">ÖDEV</div>
                <div class="solved-col">TARİH</div>
                <div class="solved-col">DURUM</div>
                <div class="solved-col"></div>
              </div>
              <div
                class="solved-list-row"
                v-for="submission in recentSubmissions"
                :key="submission.id"
              >
                <div class="solved-col">{{ submission.studentName }}</div>
                <div class="solved-col">{{ submission.courseName }}</div>
                <div class="solved-col">{{ submission.assignmentTitle }}</div>
                <div class="solved-col">{{ submission.submittedAt }}</div>
                <div class="solved-col"
                  :class="{
                    'high-score': submission.status === 'graded',
                    'mid-score': submission.status === 'pending',
                    'low-score': submission.status === 'late'
                  }"
                >
                  {{ submission.status === 'graded' ? 'Değerlendirildi' : submission.status === 'pending' ? 'Bekliyor' : 'Gecikmiş' }}
                </div>
                <div class="solved-col" style="display: flex; justify-content: flex-end; gap: 8px;">
                  <div class="report-icon-wrapper" @click="gradeSubmission(submission)">
                    <svg class="report-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20" fill="none">
                      <rect x="8" y="8" width="48" height="48" rx="6" stroke="#666" stroke-width="4" fill="none"/>
                      <polyline points="18,44 28,32 38,38 46,22" fill="none" stroke="#666" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="18" cy="44" r="3" fill="#666"/>
                      <circle cx="28" cy="32" r="3" fill="#666"/>
                      <circle cx="38" cy="38" r="3" fill="#666"/>
                      <circle cx="46" cy="22" r="3" fill="#666"/>
                      <polyline points="40,8 56,8 56,24" fill="none" stroke="#666" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="report-tooltip">Değerlendir</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2 class="section-title">Hızlı İşlemler</h2>
          <div class="actions-grid">
            <button class="action-card" @click="createAssignment">
              <div class="action-icon">
                <ri-add-line />
              </div>
              <h3 class="action-title">Ödev Oluştur</h3>
              <p class="action-description">Derslerine yeni ödev ekle</p>
            </button>

            <button class="action-card" @click="scheduleClass">
              <div class="action-icon">
                <ri-calendar-line />
              </div>
              <h3 class="action-title">Ders Planla</h3>
              <p class="action-description">Yeni ders oturumu planla</p>
            </button>

            <button class="action-card" @click="gradeAssignments">
              <div class="action-icon">
                <ri-check-line />
              </div>
              <h3 class="action-title">Ödevleri Değerlendir</h3>
              <p class="action-description">Öğrenci ödevlerini incele ve puanla</p>
            </button>

            <button class="action-card" @click="viewAnalytics">
              <div class="action-icon">
                <ri-analytics-line />
              </div>
              <h3 class="action-title">Analitikleri Görüntüle</h3>
              <p class="action-description">Ders performans metriklerini kontrol et</p>
            </button>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

// Router
const router = useRouter()

// User data
const userName = ref('Dr. Sarah Johnson')
const userRole = ref('Teacher')
const userAvatar = ref('/default-avatar.png')
const currentPage = ref('Dashboard')
const notificationCount = ref(5)
const isSidebarCollapsed = ref(false)

// Stats
const stats = ref({
  activeCourses: 4,
  totalStudents: 127,
  pendingSubmissions: 23,
  averageRating: 4.8
})

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

// Recent submissions
const recentSubmissions = ref([
  {
    id: 1,
    assignmentTitle: 'Final Proje Ödevi',
    studentName: 'Muhammet',
    studentAvatar: '/default-avatar.png',
    courseName: 'Bilgisayar Bilimi 201',
    submittedAt: '2 saat önce',
    status: 'pending'
  },
  {
    id: 2,
    assignmentTitle: 'Araştırma Makalesi',
    studentName: 'Jane Smith',
    studentAvatar: '/default-avatar.png',
    courseName: 'İngiliz Edebiyatı',
    submittedAt: '4 saat önce',
    status: 'graded'
  },
  {
    id: 3,
    assignmentTitle: 'Laboratuvar Raporu',
    studentName: 'Mike Johnson',
    studentAvatar: '/default-avatar.png',
    courseName: 'Fizik 101',
    submittedAt: '1 gün önce',
    status: 'late'
  }
])

// Today's classes
const todaysClasses = ref([
  {
    id: 1,
    title: 'Algoritma Girişi',
    courseName: 'Bilgisayar Bilimi 201',
    time: '09:00 AM',
    duration: '90 dk',
    studentCount: 32
  },
  {
    id: 2,
    title: 'Veri Yapıları Lab',
    courseName: 'Bilgisayar Bilimi 201',
    time: '02:00 PM',
    duration: '120 dk',
    studentCount: 28
  },
  {
    id: 3,
    title: 'İleri Programlama',
    courseName: 'Bilgisayar Bilimi 301',
    time: '04:30 PM',
    duration: '90 dk',
    studentCount: 25
  }
])

// Methods
const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/teacher/profile')
}

const handleSettings = () => {
  router.push('/teacher/settings')
}

const goToCourses = () => {
  router.push('/teacher/courses')
}

const viewAllClasses = () => {
  router.push('/teacher/classes')
}

const gradeSubmission = (submission) => {
  router.push(`/teacher/submissions/${submission.id}`)
}

const startClass = (classItem) => {
  router.push(`/teacher/classes/${classItem.id}`)
}

const createAssignment = () => {
  router.push('/teacher/assignments/create')
}

const scheduleClass = () => {
  router.push('/teacher/classes/schedule')
}

const gradeAssignments = () => {
  router.push('/teacher/assignments/grade')
}

const viewAnalytics = () => {
  router.push('/teacher/analytics')
}

// Lifecycle
onMounted(() => {
  console.log('Teacher dashboard mounted')
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

// KOYU TEMA OVERRIDES
body, .teacher-dashboard, .welcome-section, .stats-gradient-box, .dashboard-card, .solved-quizzes-card, .upcoming-events-card, .solved-list-table, .quiz-item, .event-item {
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

.teacher-dashboard {
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

  .quick-actions {
    .section-title {
      font-size: $font-size-l;
      font-weight: $font-weight-semi-bold;
      margin: 0 0 $space-m 0;
      color: $black;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $space-m;

      .action-card {
        background-color: $white;
        padding: $space-l;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba($black, 0.1);
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba($black, 0.15);
        }

        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: linear-gradient(135deg, $pink, darken($pink, 10%));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $font-size-m;
          color: $white;
          margin-bottom: $space-m;
        }

        .action-title {
          font-size: $font-size-m;
          font-weight: $font-weight-semi-bold;
          margin: 0 0 $space-s 0;
          color: $black;
        }

        .action-description {
          font-size: $font-size-s;
          color: rgba($black, 0.7);
          margin: 0;
          line-height: 1.4;
        }
      }
    }
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

// Stats gradient box styles
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

// Events and solved container
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
    background: #f5f6fa;
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
      background: #fafbfc;
    }
    &:hover {
      background: #fce4ec;
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
    }
  }
}

.high-score {
  color: #28a745 !important;
  font-weight: bold;
}
.mid-score {
  color: #ffc107 !important;
  font-weight: bold;
}
.low-score {
  color: #dc3545 !important;
  font-weight: bold;
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
  background: rgba(255,255,255,0.18) !important;
  color: #e67e22 !important;
  border: 1.5px solid rgba(255,255,255,0.28) !important;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}
.upcoming-events-card .event-solve-btn:hover {
  background: rgba(255,255,255,0.28) !important;
  color: #fff !important;
}
</style> 