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
      <div class="student-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Welcome back, {{ userName }}!</h1>
            <p class="welcome-subtitle">Here's what's happening with your courses today.</p>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-primary" @click="goToCourses">
              <ri-book-line />
              View Courses
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
              <p class="stat-label">Enrolled Courses</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-task-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.pendingAssignments }}</h3>
              <p class="stat-label">Pending Assignments</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-bar-chart-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.averageGrade }}%</h3>
              <p class="stat-label">Average Grade</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-check-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.completedCourses }}</h3>
              <p class="stat-label">Completed Courses</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Upcoming Deadlines -->
        <div class="dashboard-grid">
          <!-- Recent Activity -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Recent Activity</h2>
              <button class="btn btn-text" @click="viewAllActivity">View All</button>
            </div>
            <div class="card-content">
              <div class="activity-list">
                <div 
                  v-for="activity in recentActivity" 
                  :key="activity.id" 
                  class="activity-item"
                >
                  <div class="activity-icon" :class="activity.type">
                    <component :is="activity.icon" />
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.text }}</p>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Upcoming Deadlines</h2>
              <button class="btn btn-text" @click="viewAllDeadlines">View All</button>
            </div>
            <div class="card-content">
              <div class="deadline-list">
                <div 
                  v-for="deadline in upcomingDeadlines" 
                  :key="deadline.id" 
                  class="deadline-item"
                >
                  <div class="deadline-date">
                    <span class="deadline-day">{{ deadline.day }}</span>
                    <span class="deadline-month">{{ deadline.month }}</span>
                  </div>
                  <div class="deadline-content">
                    <h4 class="deadline-title">{{ deadline.title }}</h4>
                    <p class="deadline-course">{{ deadline.course }}</p>
                    <span class="deadline-time">{{ deadline.time }}</span>
                  </div>
                  <div class="deadline-actions">
                    <button class="btn btn-sm btn-outline" @click="viewDeadline(deadline)">
                      View
                    </button>
                  </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

// Router
const router = useRouter()

// User data
const userName = ref('John Doe')
const userRole = ref('Student')
const userAvatar = ref('/default-avatar.png')
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
    label: 'My Courses',
    path: '/student/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'quizzes',
    label: 'My Quizzes',
    path: '/student/quizzes',
    icon: 'ri-question-answer-line'
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

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'assignment',
    icon: 'ri-file-text-line',
    text: 'Assignment submitted for Mathematics 101',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'grade',
    icon: 'ri-star-line',
    text: 'New grade received for Physics Lab',
    time: '1 day ago'
  },
  {
    id: 3,
    type: 'course',
    icon: 'ri-book-line',
    text: 'New course material available in Chemistry',
    time: '2 days ago'
  },
  {
    id: 4,
    type: 'announcement',
    icon: 'ri-notification-line',
    text: 'Important announcement from your instructor',
    time: '3 days ago'
  }
])

// Upcoming deadlines
const upcomingDeadlines = ref([
  {
    id: 1,
    day: '15',
    month: 'Dec',
    title: 'Final Project Submission',
    course: 'Computer Science 201',
    time: '11:59 PM'
  },
  {
    id: 2,
    day: '18',
    month: 'Dec',
    title: 'Research Paper',
    course: 'English Literature',
    time: '11:59 PM'
  },
  {
    id: 3,
    day: '20',
    month: 'Dec',
    title: 'Lab Report',
    course: 'Physics 101',
    time: '11:59 PM'
  }
])

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

const viewAllActivity = () => {
  router.push('/student/activity')
}

const viewAllDeadlines = () => {
  router.push('/student/deadlines')
}

const viewDeadline = (deadline) => {
  router.push(`/student/assignments/${deadline.id}`)
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
</style> 