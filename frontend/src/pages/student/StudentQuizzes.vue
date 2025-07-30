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
    <template #breadcrumb>
      <span>Quizler</span>
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
              Yeni Sınıfa Katıl
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="student-quizzes-page">
        <h1>Quizlerim</h1>
        <div class="quiz-table-controls" style="display: flex; gap: 12px; margin-bottom: 16px; align-items: center;">
          <input v-model="search" placeholder="Quiz adı ile arayın..." class="quiz-search-input" />
          <select v-model="selectedCourse" class="quiz-filter-select">
            <option value="">Tüm Dersler</option>
            <option v-for="course in courses" :key="course">{{ course }}</option>
          </select>
          <select v-model="selectedStatus" class="quiz-filter-select">
            <option value="">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="not_started">Başlamadı</option>
          </select>
          <button class="quiz-add-btn">+ Yeni Quiz</button>
        </div>
        <div class="quiz-table-wrapper">
          <table class="quiz-table">
            <thead>
              <tr>
                <th>Quiz Adı</th>
                <th>Ders</th>
                <th>Soru Sayısı</th>
                <th>Durum</th>
                <th>Sonuç</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quiz in filteredQuizzes" :key="quiz.id">
                <td>{{ quiz.name }}</td>
                <td>{{ quiz.course }}</td>
                <td>{{ quiz.questionCount }}</td>
                <td>
                  <span :class="['quiz-status', quiz.status]">
                    {{ statusText(quiz.status) }}
                  </span>
                </td>
                <td>{{ quiz.result }}</td>
                <td>{{ quiz.startDate }}</td>
                <td>{{ quiz.endDate }}</td>
                <td>
                  <button class="quiz-action-btn">Detay</button>
                  <button v-if="quiz.status === 'not_started' || quiz.status === 'in_progress'" class="quiz-action-btn">Başla</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

const router = useRouter()
const userName = ref('Muhammet')
const userRole = ref('Öğrenci')
const userAvatar = ref('/default.png')
const currentPage = ref('Quizlerim')
const notificationCount = ref(3)
const isSidebarCollapsed = ref(false)

const navItems = ref([
  { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: 'ri-dashboard-line' },
  { id: 'courses', label: 'Dersler', path: '/student/courses', icon: 'ri-book-line' },
  { id: 'quizzes', label: 'Quizler', path: '/student/quizzes', icon: 'ri-task-line' },
  { id: 'documents', label: 'Dökümanlar', path: '/student/documents', icon: 'ri-file-text-line' },
  { id: 'profile', label: 'Profil', path: '/student/profile', icon: 'ri-user-line' }
])

// Sınıflar dropdown state ve fonksiyonları
const classrooms = [
  { id: 1, name: 'Matematik Sınıfı' },
  { id: 2, name: 'Fizik Sınıfı' },
  { id: 3, name: 'Kimya Sınıfı' },
  { id: 4, name: 'Biyoloji Sınıfı' },
  { id: 5, name: 'Tarih Sınıfı' }
]
const selectedClassroom = ref(classrooms[0])
const dropdownOpen = ref(false)
const classroomSearch = ref('')

const filteredClassrooms = computed(() => {
  if (!classroomSearch.value) return classrooms
  return classrooms.filter(c => c.name.toLowerCase().includes(classroomSearch.value.toLowerCase()))
})

function selectClassroom(classroom) {
  selectedClassroom.value = classroom
  dropdownOpen.value = false
}

function joinNewClass() {
  // Yeni sınıfa katılma işlemi burada gerçekleştirilecek
  console.log('Yeni sınıfa katılma modalı açılacak')
  dropdownOpen.value = false
}

const handleLogout = () => router.push('/auth/login')
const handleProfile = () => router.push('/student/profile')
const handleSettings = () => router.push('/student/settings')

const search = ref("");
const selectedCourse = ref("");
const selectedStatus = ref("");
const quizzes = ref([
  { id: 1, name: "Matematik 1. Dönem", course: "Matematik", questionCount: 20, status: "completed", result: "85/100", startDate: "01.05.2024", endDate: "01.05.2024" },
  { id: 2, name: "Fizik Kuvvet Testi", course: "Fizik", questionCount: 15, status: "in_progress", result: "-", startDate: "10.05.2024", endDate: "-" },
  { id: 3, name: "Kimya Asit-Baz", course: "Kimya", questionCount: 10, status: "not_started", result: "-", startDate: "15.05.2024", endDate: "-" },
  { id: 4, name: "Tarih Osmanlı", course: "Tarih", questionCount: 12, status: "completed", result: "92/100", startDate: "20.05.2024", endDate: "20.05.2024" },
  { id: 5, name: "Biyoloji Hücre", course: "Biyoloji", questionCount: 18, status: "completed", result: "78/100", startDate: "25.05.2024", endDate: "25.05.2024" },
]);

const courses = computed(() => [...new Set(quizzes.value.map(q => q.course))]);
const filteredQuizzes = computed(() =>
  quizzes.value.filter(q =>
    (q.name.toLowerCase().includes(search.value.toLowerCase())) &&
    (selectedCourse.value === '' || q.course === selectedCourse.value) &&
    (selectedStatus.value === '' || q.status === selectedStatus.value)
  )
);

function statusText(status) {
  if (status === 'completed') return 'Tamamlandı';
  if (status === 'in_progress') return 'Devam Ediyor';
  if (status === 'not_started') return 'Başlamadı';
  return '';
}
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
.student-quizzes-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 32px;
}
.quiz-table-wrapper {
  background: #111;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  padding: 24px;
}
.quiz-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}
.quiz-table th, .quiz-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #222;
  text-align: left;
}
.quiz-table th {
  background: #181818;
  color: #fff;
  font-weight: 700;
}
.quiz-table tr:last-child td {
  border-bottom: none;
}
.quiz-search-input, .quiz-filter-select {
  background: #181818;
  color: #fff;
  border: 1.5px solid #333;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
}
.quiz-search-input::placeholder {
  color: #aaa;
}
.quiz-add-btn {
  background: #e67e22;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.quiz-add-btn:hover {
  background: #ca6f1e;
}
.quiz-status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.95em;
  font-weight: 600;
}
.quiz-status.completed {
  background: #27ae60;
  color: #fff;
}
.quiz-status.in_progress {
  background: #f1c40f;
  color: #222;
}
.quiz-status.not_started {
  background: #7f8c8d;
  color: #fff;
}
.quiz-action-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  margin-right: 6px;
  font-size: 0.95em;
  cursor: pointer;
  transition: background 0.2s;
}
.quiz-action-btn:hover {
  background: #e67e22;
  color: #fff;
}
</style>
