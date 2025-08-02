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
      <div class="teacher-courses">
        <!-- Header Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Quiz Yönetimi</h1>
            <p class="welcome-subtitle">Quizlerinizi oluşturun, düzenleyin ve yönetin</p>
          </div>
        </div>
          
  
          <div class="courses-grid">
            <div
              class="course-card"
              v-for="course in courses"
              :key="course.id"
              @click="goToCourse(course)"
            >
              <div class="course-header">
                <h2 class="course-title">{{ course.title }}</h2>
                <p class="course-code">{{ course.code }}</p>
              </div>
              <div class="course-meta">
                <span><ri-group-line /> {{ course.studentCount }} Öğrenci</span>
                <span><ri-calendar-line /> {{ course.schedule }}</span>
              </div>
              <div class="course-footer">
                <button class="btn-sm btn-outline">Detay</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
  import DashboardNav from '@/components/dashboard/DashboardNav.vue'
  
  const router = useRouter()
  
  const userName = ref('Dr. Sarah Johnson')
  const userRole = ref('Teacher')
  const userAvatar = ref('/default-avatar.png')
  const currentPage = ref('Derslerim')
  const notificationCount = ref(3)
  const isSidebarCollapsed = ref(false)
  
  const navItems = ref([
    { id: 'dashboard', label: 'Dashboard', path: '/teacher/dashboard', icon: 'ri-dashboard-line' },
    { id: 'courses', label: 'Derslerim', path: '/teacher/courses', icon: 'ri-book-line' },
    { id: 'quizzes', label: 'Quizler', path: '/teacher/quizzes', icon: 'ri-task-line' },
    { id: 'students', label: 'Öğrenciler', path: '/teacher/students', icon: 'ri-group-line' },
    { id: 'grades', label: 'Notlar', path: '/teacher/grades', icon: 'ri-bar-chart-line' },
    { id: 'analytics', label: 'Analitik', path: '/teacher/analytics', icon: 'ri-analytics-line' },
    { id: 'profile', label: 'Profil', path: '/teacher/profile', icon: 'ri-user-line' }
  ])
  
  const courses = ref([
    {
      id: 1,
      title: 'Bilgisayar Bilimi 101',
      code: 'CS101',
      studentCount: 32,
      schedule: 'Pzt & Çrş 09:00 - 10:30'
    },
    {
      id: 2,
      title: 'Algoritmalar',
      code: 'CS202',
      studentCount: 28,
      schedule: 'Salı 11:00 - 13:00'
    },
    {
      id: 3,
      title: 'Veri Yapıları',
      code: 'CS303',
      studentCount: 30,
      schedule: 'Cuma 14:00 - 16:00'
    }
  ])
  
  const createCourse = () => {
    router.push('/teacher/courses/create')
  }
  
  const goToCourse = (course) => {
    router.push(`/teacher/courses/${course.id}`)
  }
  
  const handleLogout = () => router.push('/auth/login')
  const handleProfile = () => router.push('/teacher/profile')
  const handleSettings = () => router.push('/teacher/settings')
  </script>
  
  <style scoped lang="scss">
  .courses-page {
    padding: 24px;
  
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
  
      h1 {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
      }
  
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
    }
  
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }
  
    .course-card {
      background: #111;
      border: 2px solid rgba(255, 255, 255, 0.08);
      padding: 18px;
      border-radius: 12px;
      transition: transform 0.2s;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
      &:hover {
        transform: translateY(-4px);
      }
  
      .course-title {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 4px 0;
      }
  
      .course-code {
        color: #ccc;
        font-size: 14px;
        margin: 0;
      }
  
      .course-meta {
        margin-top: 12px;
        font-size: 13px;
        color: #aaa;
        display: flex;
        flex-direction: column;
        gap: 4px;
  
        i {
          margin-right: 4px;
        }
      }
  
      .course-footer {
        margin-top: 14px;
  
        .btn-sm {
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 6px;
        }
      }
    }
  }
  </style>
  