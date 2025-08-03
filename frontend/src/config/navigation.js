// Navigation configurations for different user roles
export const teacherNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/teacher/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'lessons',
    label: 'Derslerim',
    path: '/teacher/lessons',
    icon: 'ri-book-line'
  },
  {
    id: 'create-quiz',
    label: 'Quiz Oluştur',
    path: '/teacher/create-quiz',
    icon: 'ri-add-circle-line'
  },
  {
    id: 'quizzes',
    label: 'Quizlerim',
    path: '/teacher/quizzes',
    icon: 'ri-task-line'
  },
  {
    id: 'students',
    label: 'Öğrencilerim',
    path: '/teacher/students',
    icon: 'ri-group-line'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/teacher/profile',
    icon: 'ri-user-line'
  }
]

export const studentNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/student/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'lessons',
    label: 'Dersler',
    path: '/student/lessons',
    icon: 'ri-book-line'
  },
  {
    id: 'quizzes',
    label: 'Quizler',
    path: '/student/quizzes',
    icon: 'ri-task-line'
  },
  {
    id: 'create-quiz',
    label: 'Quiz Oluştur',
    path: '/student/create-quiz',
    icon: 'ri-add-circle-line'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/student/profile',
    icon: 'ri-user-line'
  }
] 