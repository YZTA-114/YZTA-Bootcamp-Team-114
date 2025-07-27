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
      <div class="student-courses">
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">
              <span class="title-icon">🎓📚</span>
              Tüm Dersler
            </h1>
          </div>
          <div class="header-right">
            <button class="filter-btn">
              <i class="ri-filter-3-line"></i>
              Filtrele
              <i class="ri-arrow-down-s-line"></i>
            </button>
          </div>
        </div>

        <div class="courses-grid">
          <div 
            v-for="course in courses" 
            :key="course.id" 
            class="course-card"
            @click="viewCourse(course)"
          >
            <div class="course-icon-wrapper" :class="course.colorClass">
              <div class="course-icon">
                <component :is="course.icon" />
              </div>
            </div>
            
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-instructor">Eğitmen: {{ course.instructor }}</p>
              
              <div class="course-arrow">
                <i class="ri-arrow-right-line"></i>
              </div>
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

// Router
const router = useRouter()

// Kullanıcı bilgileri
const userName = ref('Muhammet')
const userRole = ref('Öğrenci')
const userAvatar = ref('/default.png')
const currentPage = ref('Derslerim')
const notificationCount = ref(3)

// Navigation items (StudentDashboard.vue ile aynı ve Türkçe)
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
    id: 'documents',
    label: 'Dokümanlarım',
    path: '/student/documents',
    icon: 'ri-file-text-line'
  },
  {
    id: 'calendar',
    label: 'Takvim',
    path: '/student/calendar',
    icon: 'ri-calendar-line'
  },
  {
    id: 'profile',
    label: 'Profil',
    path: '/student/profile',
    icon: 'ri-user-line'
  }
])

// Örnek ders verisi (Tasarım ilhamına göre güncellendi)
const courses = ref([
  {
    id: 1,
    title: 'Video Düzenleme',
    instructor: 'Andy J. Pizza',
    icon: 'ri-video-line',
    colorClass: 'blue-bg'
  },
  {
    id: 2,
    title: '3D Render',
    instructor: 'Saidul Islam',
    icon: 'ri-cube-line',
    colorClass: 'gray-bg'
  },
  {
    id: 3,
    title: 'Dijital Pazarlama',
    instructor: 'Wahab K.',
    icon: 'ri-line-chart-line',
    colorClass: 'blue-bg'
  },
  {
    id: 4,
    title: 'VR Eğitimi',
    instructor: 'Moni Islam',
    icon: 'ri-vr-line',
    colorClass: 'pink-bg'
  },
  {
    id: 5,
    title: 'PS4 Oyun',
    instructor: 'W. Sheikh',
    icon: 'ri-gamepad-line',
    colorClass: 'blue-bg'
  },
  {
    id: 6,
    title: 'Fotoğrafçılık',
    instructor: 'S.J. Kabir',
    icon: 'ri-camera-line',
    colorClass: 'purple-bg'
  }
])

// Methods
const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/student/profile')
}

const handleSettings = () => {
  router.push('/student/settings')
}

const viewCourse = (course) => {
  router.push(`/student/courses/${course.id}`)
}


</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.student-courses {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-xl;
    padding: $space-l 0;

    .header-left {
      .page-title {
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        color: $black;
        margin: 0;
        display: flex;
        align-items: center;
        gap: $space-s;

        .title-icon {
          font-size: $font-size-xl;
        }
      }
    }

    .header-right {
      .filter-btn {
        display: flex;
        align-items: center;
        gap: $space-xs;
        padding: $space-s $space-m;
        background: $white;
        border: 1px solid rgba($black, 0.1);
        border-radius: 8px;
        font-size: $font-size-s;
        font-weight: $font-weight-semi-bold;
        color: $black;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba($black, 0.05);
          border-color: rgba($black, 0.2);
        }

        i {
          font-size: $font-size-s;
        }
      }
    }
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $space-l;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $space-m;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .course-card {
    background-color: $white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba($black, 0.08);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba($black, 0.05);

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 24px rgba($black, 0.12);
      border-color: rgba($black, 0.1);
    }

    .course-icon-wrapper {
      padding: $space-xl;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 120px;

      &.blue-bg {
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      }

      &.gray-bg {
        background: linear-gradient(135deg, #f5f5f5, #eeeeee);
      }

      &.pink-bg {
        background: linear-gradient(135deg, #fce4ec, #f8bbd9);
      }

      &.purple-bg {
        background: linear-gradient(135deg, #f3e5f5, #e1bee7);
      }

      .course-icon {
        font-size: 48px;
        color: $black;
        opacity: 0.8;
      }
    }

    .course-content {
      padding: $space-l;
      position: relative;

      .course-title {
        font-size: $font-size-l;
        font-weight: $font-weight-bold;
        color: $black;
        margin: 0 0 $space-s 0;
        line-height: 1.3;
      }

      .course-instructor {
        font-size: $font-size-s;
        color: rgba($black, 0.7);
        margin: 0;
        font-weight: $font-weight-semi-bold;
      }

      .course-arrow {
        position: absolute;
        top: $space-l;
        right: $space-l;
        width: 32px;
        height: 32px;
        background: rgba($black, 0.05);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        i {
          font-size: $font-size-s;
          color: rgba($black, 0.6);
        }
      }

      &:hover .course-arrow {
        background: rgba($black, 0.1);
        
        i {
          color: $black;
        }
      }
    }
  }
}


</style> 