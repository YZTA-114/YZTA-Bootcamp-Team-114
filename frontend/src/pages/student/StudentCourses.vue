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
      <DashboardNav :nav-items="navItems" :collapsed="false" />
    </template>

    <template #content>
      <div class="student-courses">
        <div class="page-header">
          <h1 class="page-title">My Courses</h1>
          <p class="page-subtitle">Manage and view your enrolled courses</p>
        </div>

        <div class="courses-grid">
          <div 
            v-for="course in courses" 
            :key="course.id" 
            class="course-card"
            @click="viewCourse(course)"
          >
            <div class="course-header">
              <div class="course-icon">
                <component :is="course.icon" />
              </div>
              <div class="course-status" :class="course.status">
                {{ course.status }}
              </div>
            </div>
            
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-instructor">{{ course.instructor }}</p>
              <p class="course-description">{{ course.description }}</p>
              
              <div class="course-stats">
                <div class="stat">
                  <span class="stat-label">Progress</span>
                  <span class="stat-value">{{ course.progress }}%</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Grade</span>
                  <span class="stat-value">{{ course.grade }}%</span>
                </div>
              </div>
            </div>
            
            <div class="course-footer">
              <button class="btn btn-primary" @click.stop="continueCourse(course)">
                Continue
              </button>
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

// User data
const userName = ref('John Doe')
const userRole = ref('Student')
const userAvatar = ref('/default-avatar.png')
const currentPage = ref('My Courses')
const notificationCount = ref(3)

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
    label: 'My Courses',
    path: '/student/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    path: '/student/assignments',
    icon: 'ri-task-line'
  },
  {
    id: 'grades',
    label: 'Grades',
    path: '/student/grades',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/student/calendar',
    icon: 'ri-calendar-line'
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/student/resources',
    icon: 'ri-folder-line'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/student/profile',
    icon: 'ri-user-line'
  }
])

// Sample courses data
const courses = ref([
  {
    id: 1,
    title: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Johnson',
    description: 'Learn the fundamentals of programming and computer science concepts.',
    icon: 'ri-code-line',
    status: 'active',
    progress: 75,
    grade: 87
  },
  {
    id: 2,
    title: 'Advanced Mathematics',
    instructor: 'Prof. Michael Chen',
    description: 'Advanced mathematical concepts including calculus and linear algebra.',
    icon: 'ri-function-line',
    status: 'active',
    progress: 60,
    grade: 92
  },
  {
    id: 3,
    title: 'English Literature',
    instructor: 'Dr. Emily Davis',
    description: 'Explore classic and contemporary literature from around the world.',
    icon: 'ri-book-line',
    status: 'completed',
    progress: 100,
    grade: 89
  },
  {
    id: 4,
    title: 'Physics Fundamentals',
    instructor: 'Prof. Robert Wilson',
    description: 'Understanding the basic principles of physics and their applications.',
    icon: 'ri-atom-line',
    status: 'active',
    progress: 45,
    grade: 78
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

const continueCourse = (course) => {
  router.push(`/student/courses/${course.id}/continue`)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.student-courses {
  .page-header {
    margin-bottom: $space-l;

    .page-title {
      font-size: $font-size-xxl;
      font-weight: $font-weight-bold;
      color: $black;
      margin: 0 0 $space-s 0;
    }

    .page-subtitle {
      font-size: $font-size-m;
      color: rgba($black, 0.7);
      margin: 0;
    }
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $space-l;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .course-card {
    background-color: $white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba($black, 0.1);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba($black, 0.15);
    }

    .course-header {
      padding: $space-l;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, $pink, darken($pink, 10%));
      color: $white;

      .course-icon {
        font-size: $font-size-xl;
      }

      .course-status {
        padding: $space-xs $space-s;
        border-radius: 20px;
        font-size: $font-size-xs;
        font-weight: $font-weight-semi-bold;
        text-transform: uppercase;

        &.active {
          background-color: rgba($white, 0.2);
        }

        &.completed {
          background-color: rgba($white, 0.2);
        }
      }
    }

    .course-content {
      padding: $space-l;

      .course-title {
        font-size: $font-size-l;
        font-weight: $font-weight-semi-bold;
        color: $black;
        margin: 0 0 $space-s 0;
      }

      .course-instructor {
        font-size: $font-size-s;
        color: $pink;
        font-weight: $font-weight-semi-bold;
        margin: 0 0 $space-s 0;
      }

      .course-description {
        font-size: $font-size-s;
        color: rgba($black, 0.7);
        margin: 0 0 $space-m 0;
        line-height: 1.4;
      }

      .course-stats {
        display: flex;
        gap: $space-m;

        .stat {
          flex: 1;
          text-align: center;

          .stat-label {
            display: block;
            font-size: $font-size-xs;
            color: rgba($black, 0.6);
            margin-bottom: $space-xs;
          }

          .stat-value {
            display: block;
            font-size: $font-size-m;
            font-weight: $font-weight-semi-bold;
            color: $black;
          }
        }
      }
    }

    .course-footer {
      padding: $space-l;
      border-top: 1px solid rgba($black, 0.1);

      .btn {
        width: 100%;
        justify-content: center;
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
}
</style> 