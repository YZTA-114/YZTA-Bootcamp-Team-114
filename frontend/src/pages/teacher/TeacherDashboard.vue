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
      <div class="teacher-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Welcome back, {{ userName }}!</h1>
            <p class="welcome-subtitle">Here's your teaching overview for today.</p>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-primary" @click="goToCourses">
              <ri-book-line />
              Manage Courses
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <ri-book-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.activeCourses }}</h3>
              <p class="stat-label">Active Courses</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-group-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.totalStudents }}</h3>
              <p class="stat-label">Total Students</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-file-text-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.pendingSubmissions }}</h3>
              <p class="stat-label">Pending Submissions</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ri-star-line />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.averageRating }}/5</h3>
              <p class="stat-label">Average Rating</p>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
          <!-- Recent Submissions -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Recent Submissions</h2>
              <button class="btn btn-text" @click="viewAllSubmissions">View All</button>
            </div>
            <div class="card-content">
              <div class="submission-list">
                <div 
                  v-for="submission in recentSubmissions" 
                  :key="submission.id" 
                  class="submission-item"
                >
                  <div class="submission-avatar">
                    <img :src="submission.studentAvatar" :alt="submission.studentName" />
                  </div>
                  <div class="submission-content">
                    <h4 class="submission-title">{{ submission.assignmentTitle }}</h4>
                    <p class="submission-student">{{ submission.studentName }}</p>
                    <p class="submission-course">{{ submission.courseName }}</p>
                    <span class="submission-time">{{ submission.submittedAt }}</span>
                  </div>
                  <div class="submission-actions">
                    <button class="btn btn-sm btn-primary" @click="gradeSubmission(submission)">
                      Grade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Classes -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Today's Classes</h2>
              <button class="btn btn-text" @click="viewAllClasses">View All</button>
            </div>
            <div class="card-content">
              <div class="class-list">
                <div 
                  v-for="classItem in todaysClasses" 
                  :key="classItem.id" 
                  class="class-item"
                >
                  <div class="class-time">
                    <span class="class-hour">{{ classItem.time }}</span>
                    <span class="class-duration">{{ classItem.duration }}</span>
                  </div>
                  <div class="class-content">
                    <h4 class="class-title">{{ classItem.title }}</h4>
                    <p class="class-course">{{ classItem.courseName }}</p>
                    <p class="class-students">{{ classItem.studentCount }} students</p>
                  </div>
                  <div class="class-actions">
                    <button class="btn btn-sm btn-outline" @click="startClass(classItem)">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2 class="section-title">Quick Actions</h2>
          <div class="actions-grid">
            <button class="action-card" @click="createAssignment">
              <div class="action-icon">
                <ri-add-line />
              </div>
              <h3 class="action-title">Create Assignment</h3>
              <p class="action-description">Add a new assignment to your courses</p>
            </button>

            <button class="action-card" @click="scheduleClass">
              <div class="action-icon">
                <ri-calendar-line />
              </div>
              <h3 class="action-title">Schedule Class</h3>
              <p class="action-description">Schedule a new class session</p>
            </button>

            <button class="action-card" @click="gradeAssignments">
              <div class="action-icon">
                <ri-check-line />
              </div>
              <h3 class="action-title">Grade Assignments</h3>
              <p class="action-description">Review and grade student submissions</p>
            </button>

            <button class="action-card" @click="viewAnalytics">
              <div class="action-icon">
                <ri-analytics-line />
              </div>
              <h3 class="action-title">View Analytics</h3>
              <p class="action-description">Check course performance metrics</p>
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
    label: 'My Courses',
    path: '/teacher/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    path: '/teacher/assignments',
    icon: 'ri-task-line'
  },
  {
    id: 'students',
    label: 'Students',
    path: '/teacher/students',
    icon: 'ri-group-line'
  },
  {
    id: 'grades',
    label: 'Grades',
    path: '/teacher/grades',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/teacher/calendar',
    icon: 'ri-calendar-line'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/teacher/analytics',
    icon: 'ri-analytics-line'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/teacher/profile',
    icon: 'ri-user-line'
  }
])

// Recent submissions
const recentSubmissions = ref([
  {
    id: 1,
    assignmentTitle: 'Final Project Submission',
    studentName: 'John Doe',
    studentAvatar: '/default-avatar.png',
    courseName: 'Computer Science 201',
    submittedAt: '2 hours ago'
  },
  {
    id: 2,
    assignmentTitle: 'Research Paper',
    studentName: 'Jane Smith',
    studentAvatar: '/default-avatar.png',
    courseName: 'English Literature',
    submittedAt: '4 hours ago'
  },
  {
    id: 3,
    assignmentTitle: 'Lab Report',
    studentName: 'Mike Johnson',
    studentAvatar: '/default-avatar.png',
    courseName: 'Physics 101',
    submittedAt: '1 day ago'
  }
])

// Today's classes
const todaysClasses = ref([
  {
    id: 1,
    title: 'Introduction to Algorithms',
    courseName: 'Computer Science 201',
    time: '09:00 AM',
    duration: '90 min',
    studentCount: 32
  },
  {
    id: 2,
    title: 'Data Structures Lab',
    courseName: 'Computer Science 201',
    time: '02:00 PM',
    duration: '120 min',
    studentCount: 28
  },
  {
    id: 3,
    title: 'Advanced Programming',
    courseName: 'Computer Science 301',
    time: '04:30 PM',
    duration: '90 min',
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

const viewAllSubmissions = () => {
  router.push('/teacher/submissions')
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

.teacher-dashboard {
  .welcome-section {
    background: linear-gradient(135deg, $pink 0%, darken($pink, 15%) 100%);
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
    margin-bottom: $space-l;

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

  .submission-list {
    .submission-item {
      display: flex;
      align-items: center;
      gap: $space-m;
      padding: $space-s 0;
      border-bottom: 1px solid rgba($black, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .submission-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .submission-content {
        flex: 1;

        .submission-title {
          font-size: $font-size-s;
          font-weight: $font-weight-semi-bold;
          margin: 0 0 $space-xs 0;
          color: $black;
        }

        .submission-student {
          font-size: $font-size-xs;
          color: $pink;
          margin: 0 0 $space-xs 0;
          font-weight: $font-weight-semi-bold;
        }

        .submission-course {
          font-size: $font-size-xs;
          color: rgba($black, 0.7);
          margin: 0 0 $space-xs 0;
        }

        .submission-time {
          font-size: $font-size-xs;
          color: rgba($black, 0.6);
        }
      }

      .submission-actions {
        .btn-sm {
          padding: $space-xs $space-s;
          font-size: $font-size-xs;
        }
      }
    }
  }

  .class-list {
    .class-item {
      display: flex;
      align-items: center;
      gap: $space-m;
      padding: $space-s 0;
      border-bottom: 1px solid rgba($black, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .class-time {
        text-align: center;
        min-width: 80px;

        .class-hour {
          display: block;
          font-size: $font-size-s;
          font-weight: $font-weight-semi-bold;
          color: $pink;
        }

        .class-duration {
          display: block;
          font-size: $font-size-xs;
          color: rgba($black, 0.6);
        }
      }

      .class-content {
        flex: 1;

        .class-title {
          font-size: $font-size-s;
          font-weight: $font-weight-semi-bold;
          margin: 0 0 $space-xs 0;
          color: $black;
        }

        .class-course {
          font-size: $font-size-xs;
          color: rgba($black, 0.7);
          margin: 0 0 $space-xs 0;
        }

        .class-students {
          font-size: $font-size-xs;
          color: $orange;
          font-weight: $font-weight-semi-bold;
        }
      }

      .class-actions {
        .btn-sm {
          padding: $space-xs $space-s;
          font-size: $font-size-xs;
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
</style> 