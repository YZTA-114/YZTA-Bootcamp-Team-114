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
      <div class="sidebar-classroom-dropdown">
        <div class="dropdown-selected" @click="dropdownOpen = !dropdownOpen">
          {{ selectedClassroom.name }}
          <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
        </div>
        <div v-if="dropdownOpen" class="dropdown-list">
          <div
            v-for="classroom in classrooms"
            :key="classroom.id"
            class="dropdown-item"
            @click="selectClassroom(classroom)"
          >
            {{ classroom.name }}
          </div>
        </div>
      </div>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>

    <template #content>
      <div class="student-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Hoşgeldin Muhammet</h1>
            <p class="welcome-subtitle">Bugün derslerinde neler var.</p>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-primary" @click="goToCourses">
              <ri-book-line />
              Dersleri Görüntüle
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <ri-graduation-cap-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.enrolledCourses }}</h3>
              <p class="stat-label">Kayıtlı Dersler</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-task-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.pendingAssignments }}</h3>
              <p class="stat-label">Bekleyen Quizler</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-bar-chart-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.averageGrade }}%</h3>
              <p class="stat-label">Başarı Oranı</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-check-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.completedCourses }}</h3>
              <p class="stat-label">Tamamlanan Dersler</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Upcoming Deadlines -->
        <div class="dashboard-grid">
          <!-- Recent Activity -->
          <div class="dashboard-card quiz-card">
            <div class="card-header">
              <h2 class="card-title">Öğretmen Quiz</h2>
              <!-- <button class="btn btn-primary" @click="solveQuiz">ÇÖZ</button> -->
            </div>
            <div class="card-content">
              <div class="quiz-list">
                <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
                  <div class="quiz-info">
                    <div class="quiz-row"><strong>Quiz Adı:</strong> {{ quiz.name }}</div>
                    <div class="quiz-row"><strong>Süre:</strong> {{ quiz.duration }} dk</div>
                    <div class="quiz-row"><strong>Ders:</strong> {{ quiz.course }}</div>
                  </div>
                  <div class="quiz-actions">
                    <button class="btn btn-sm btn-solve" @click="solveQuiz(quiz)">Çöz</button>
                    <button class="btn btn-sm btn-danger" @click="deleteQuiz(quiz)">Sil</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="dashboard-card quiz-card">
            <div class="card-header">
              <h2 class="card-title">Benim Quiz'im</h2>
            </div>
            <div class="card-content">
              <div class="quiz-list">
                <div v-for="quiz in myQuizzes" :key="quiz.id" class="quiz-item">
                  <div class="quiz-info">
                    <div class="quiz-row"><strong>Quiz Adı:</strong> {{ quiz.name }}</div>
                    <div class="quiz-row"><strong>Süre:</strong> {{ quiz.duration }} dk</div>
                    <div class="quiz-row"><strong>Ders:</strong> {{ quiz.course }}</div>
                  </div>
                  <div class="quiz-actions">
                    <button class="btn btn-sm btn-solve" @click="solveMyQuiz(quiz)">Çöz</button>
                    <button class="btn btn-sm btn-danger" @click="deleteMyQuiz(quiz)">Sil</button>
                  </div>
                </div>
              </div>
              <div class="myquiz-bottom-actions">
                <button class="btn btn-primary" @click="createQuiz">Yeni Quiz Oluştur</button>
              </div>
            </div>
          </div>
          <!-- Çözdüklerim -->
          <div class="dashboard-card solved-card">
            <div class="card-header">
              <h2 class="card-title">Çözdüklerim</h2>
            </div>
            <div class="card-content">
              <table class="solved-table">
                <thead>
                  <tr>
                    <th>Ders Adı</th>
                    <th>Çözülen Süre (dk)</th>
                    <th>Doğru Sayısı</th>
                    <th>Toplam Soru</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in solvedList" :key="item.id">
                    <td>{{ item.course }}</td>
                    <td>{{ item.duration }}</td>
                    <td>{{ item.correct }}</td>
                    <td>{{ item.total }}</td>
                    <td>
                      <button class="btn btn-primary" @click="showReport(item)">Rapor</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
const userName = ref('Muhammet')
const userRole = ref('Student')
const userAvatar = ref('/default.png')
const currentPage = ref('Dashboard')
const notificationCount = ref(3)

// Stats
const stats = ref({
  enrolledCourses: 5,
  pendingAssignments: 8,
  averageGrade: 87,
  completedCourses: 12
})

// Navigation items
const navItems = ref([
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/student/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'courses',
    label: 'Dersler',
    path: '/student/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'assignments',
    label: 'Quizler',
    path: '/student/assignments',
    icon: 'ri-task-line'
  },
  {
    id: 'grades',
    label: 'Dokümanlar',
    path: '/student/documents',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'calendar',
    label: 'Takvim',
    path: '/student/calendar',
    icon: 'ri-calendar-line'
  },
  {
    id: 'resources',
    label: 'Kaynaklarım',
    path: '/student/documents',
    icon: 'ri-folder-line'
  },
  {
    id: 'profile',
    label: 'Profil',
    path: '/student/profile',
    icon: 'ri-user-line'
  }
])

// Benim Quiz'im verisi
const myQuizzes = ref([
  { id: 1, name: 'Tarih Quiz 1', duration: 10, course: 'Tarih' },
  { id: 2, name: 'Biyoloji Quiz 2', duration: 18, course: 'Biyoloji' },
  { id: 3, name: 'Coğrafya Quiz 3', duration: 12, course: 'Coğrafya' }
])

function createQuiz() {
  alert('Yeni quiz oluşturma sayfasına yönlendirilecek!')
}
function solveMyQuiz(quiz) {
  alert(quiz.name + ' quizini çözme sayfasına yönlendirilecek!')
}
function deleteMyQuiz(quiz) {
  alert('Sil: ' + quiz.name)
}

// Classroom dropdown için veri
const classrooms = [
  { id: 1, name: 'Classroom 1' },
  { id: 2, name: 'Classroom 2' },
  { id: 3, name: 'Classroom 3' }
]
const selectedClassroom = ref(classrooms[0])
const dropdownOpen = ref(false)

function selectClassroom(classroom) {
  selectedClassroom.value = classroom
  dropdownOpen.value = false
  // İstersen burada route değişimi de ekleyebilirsin
}

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

// Quiz verisi
const quizzes = ref([
  { id: 1, name: 'Matematik Quiz 1', duration: 20, course: 'Matematik' },
  { id: 2, name: 'Fizik Quiz 2', duration: 15, course: 'Fizik' },
  { id: 3, name: 'Kimya Quiz 3', duration: 25, course: 'Kimya' }
])

function deleteQuiz(quiz) {
  alert('Sil: ' + quiz.name)
}

// Çözdüklerim verisi
const solvedList = ref([
  { id: 1, course: 'Matematik', duration: 18, correct: 8, total: 10 },
  { id: 2, course: 'Fizik', duration: 15, correct: 7, total: 10 },
  { id: 3, course: 'Kimya', duration: 20, correct: 9, total: 10 }
])
function showReport(item) {
  alert(item.course + ' dersi için rapor sayfasına yönlendirilecek!')
}

// Lifecycle
onMounted(() => {
  // Fetch user data and stats
  console.log('Student dashboard mounted')
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.student-dashboard {
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  .welcome-section {
    background: $orange;
    color: $white;
    padding: $space-xl;
    border-radius: 12px;
    margin-bottom: $space-l;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .welcome-content {
      .welcome-title {
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        margin: 0 0 $space-s 0;
      }

      .welcome-subtitle {
        font-size: $font-size-m;
        opacity: 0.9;
        margin: 0;
      }
    }

    .welcome-actions {
      .btn {
        background-color: rgba($white, 0.2);
        border: 1px solid rgba($white, 0.3);
        color: $white;
        padding: $space-s $space-l;
        border-radius: 8px;
        font-weight: $font-weight-semi-bold;
        transition: all 0.2s ease;

        &:hover {
          background-color: rgba($white, 0.3);
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
      padding: $space-l;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba($black, 0.1);
      display: flex;
      align-items: center;
      gap: $space-m;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-4px);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-l;
        color: $white;

        &:nth-child(1) {
          background: linear-gradient(135deg, $pink, darken($pink, 10%));
        }

        &:nth-child(2) {
          background: linear-gradient(135deg, $orange, darken($orange, 10%));
        }

        &:nth-child(3) {
          background: linear-gradient(135deg, $yellow, darken($yellow, 10%));
        }

        &:nth-child(4) {
          background: linear-gradient(135deg, #28a745, darken(#28a745, 10%));
        }
      }

      .stat-content {
        .stat-number {
          font-size: $font-size-xxl;
          font-weight: $font-weight-bold;
          margin: 0 0 $space-xs 0;
          color: $black;
        }

        .stat-label {
          font-size: $font-size-s;
          color: rgba($black, 0.7);
          margin: 0;
        }
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
    background-color: $white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba($black, 0.1);
    overflow: hidden;

    .card-header {
      padding: $space-l;
      border-bottom: 1px solid rgba($black, 0.1);
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
}
.dropdown-selected {
  font-size: 1.3rem;
  font-weight: bold;
  background: #f5f5f5;
  color: #222;
  padding: 18px 24px;
  border-radius: 10px;
  width: 90%;
  min-width: 200px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.dropdown-arrow {
  margin-left: 10px;
  font-size: 1.1rem;
  transition: transform 0.2s;
  &.open {
    transform: rotate(180deg);
  }
}
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  z-index: 10;
  width: 100%;
}
.dropdown-item {
  padding: 14px 24px;
  font-size: 1.1rem;
  color: #222;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s;
  &:hover {
    background: #f0f0f0;
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
.solved-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 18px;
  background: #fff;
  border: 2px solid $pink;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba($pink, 0.08);
  overflow: hidden;
  th, td {
    border-bottom: 1px solid #eee;
    padding: 14px 10px;
    text-align: center;
    font-size: $font-size-s;
    color: $black;
  }
  th {
    background: $pink;
    color: $white;
    font-weight: $font-weight-bold;
    font-size: $font-size-m;
    letter-spacing: 0.5px;
    border-bottom: 2px solid darken($pink, 10%);
  }
  tr {
    &:nth-child(even) {
      background: #fdf2f8;
    }
    &:nth-child(odd) {
      background: #fff;
    }
  }
  tr:last-child td {
    border-bottom: none;
  }
}
</style> 