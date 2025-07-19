import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue')
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue')
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/auth/ForgotPasswordPage.vue')
  },
  {
    path: '/register/select-type',
    name: 'register-type-select',
    component: () => import('@/pages/auth/RegisterTypeSelectPage.vue')
  },
  {
    path: '/register/student',
    name: 'register-student',
    component: () => import('@/pages/auth/StudentRegisterPage.vue')
  },
  {
    path: '/register/teacher',
    name: 'register-teacher',
    component: () => import('@/pages/auth/TeacherRegisterPage.vue')
  },
  // Student Dashboard Routes
  {
    path: '/student',
    name: 'student',
    redirect: '/student/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: () => import('@/pages/student/StudentDashboard.vue')
      },
      /* {
        path: 'courses',
        name: 'student-courses',
        component: () => import('@/pages/student/StudentCourses.vue')
      },
      {
        path: 'assignments',
        name: 'student-assignments',
        component: () => import('@/pages/student/StudentAssignments.vue')
      },
      {
        path: 'grades',
        name: 'student-grades',
        component: () => import('@/pages/student/StudentGrades.vue')
      },
      {
        path: 'calendar',
        name: 'student-calendar',
        component: () => import('@/pages/student/StudentCalendar.vue')
      },
      {
        path: 'resources',
        name: 'student-resources',
        component: () => import('@/pages/student/StudentResources.vue')
      },
      {
        path: 'profile',
        name: 'student-profile',
        component: () => import('@/pages/student/StudentProfile.vue')
      } */
    ]
  },
  // Teacher Dashboard Routes
  {
    path: '/teacher',
    name: 'teacher',
    redirect: '/teacher/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'teacher-dashboard',
        component: () => import('@/pages/teacher/TeacherDashboard.vue')
      },
      /* {
        path: 'courses',
        name: 'teacher-courses',
        component: () => import('@/pages/teacher/TeacherCourses.vue')
      },
      {
        path: 'assignments',
        name: 'teacher-assignments',
        component: () => import('@/pages/teacher/TeacherAssignments.vue')
      },
      {
        path: 'students',
        name: 'teacher-students',
        component: () => import('@/pages/teacher/TeacherStudents.vue')
      },
      {
        path: 'grades',
        name: 'teacher-grades',
        component: () => import('@/pages/teacher/TeacherGrades.vue')
      },
      {
        path: 'calendar',
        name: 'teacher-calendar',
        component: () => import('@/pages/teacher/TeacherCalendar.vue')
      },
      {
        path: 'analytics',
        name: 'teacher-analytics',
        component: () => import('@/pages/teacher/TeacherAnalytics.vue')
      },
      {
        path: 'profile',
        name: 'teacher-profile',
        component: () => import('@/pages/teacher/TeacherProfile.vue')
      } */
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

export default router 