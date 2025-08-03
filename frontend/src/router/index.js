import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { requiredAuth: false },
    component: () => import('@/pages/home/HomePage.vue')
  },
  {
    path: '/auth/login',
    name: 'login',
    meta: { requiredAuth: false },
    component: () => import('@/pages/auth/LoginPage.vue')
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    meta: { requiredAuth: false },
    component: () => import('@/pages/auth/ForgotPasswordPage.vue')
  },
  {
    path: '/register/select-type',
    name: 'register-type-select',
    meta: { requiredAuth: false },
    component: () => import('@/pages/auth/RegisterTypeSelectPage.vue')
  },
  {
    path: '/register/student',
    name: 'register-student',
    meta: { requiredAuth: false },
    component: () => import('@/pages/auth/StudentRegisterPage.vue')
  },
  {
    path: '/register/teacher',
    name: 'register-teacher',
    meta: { requiredAuth: false },
    component: () => import('@/pages/auth/TeacherRegisterPage.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiredAuth: true },
    beforeEnter: async (to, from, next) => {
      const auth = await isAuthenticated();
      if (auth.status && auth.user) {
        if (auth.user.role === 'student') {
          next({ name: 'student-dashboard' });
        } else if (auth.user.role === 'teacher') {
          next({ name: 'teacher-dashboard' });
        }
      } else {
        next({ name: 'login' });
      }
    }
  },
  // Student Dashboard Routes
  {
    path: '/student',
    name: 'student',
    redirect: '/student/dashboard',
    meta: { requiredAuth: true, requiredRole: 'student' },
    children: [
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: () => import('@/pages/student/StudentDashboard.vue'),
        meta: { requiresAuth: true, role: 'student' }
      },
      {
        path: 'join-classroom',
        name: 'JoinClassroom',
        component: () => import('@/pages/student/JoinClassroom.vue'),
        meta: { requiresAuth: true, role: 'student' }
      },
      {
        path: 'documents',
        name: 'student-documents',
        component: () => import('@/pages/student/StudentDocuments.vue')
      },
      {
        path: 'lessons',
        name: 'student-lessons',
        component: () => import('@/pages/student/StudentLessons.vue')
      },
      {
        path: 'quizzes',
        name: 'student-quizzes',
        component: () => import('@/pages/student/StudentQuizzes.vue')
      },
      {
        path: 'create-quiz',
        name: 'student-create-quiz',
        component: () => import('@/pages/shared/CreateQuiz.vue')
      },
      {
        path: 'profile',
        name: 'student-profile',
        component: () => import('@/pages/student/StudentProfile.vue')
      },
    ]
  },
  // Teacher Dashboard Routes
  {
    path: '/teacher',
    name: 'teacher',
    redirect: '/teacher/dashboard',
    meta: { requiredAuth: true, requiredRole: 'teacher' },
    children: [
      {
        path: 'dashboard',
        name: 'teacher-dashboard',
        component: () => import('@/pages/teacher/TeacherDashboard.vue')
      },
      {
        path: 'create-classroom',
        name: 'create-classroom',
        component: () => import('@/pages/teacher/CreateClassroom.vue')
      },
      {
        path: 'create-quiz',
        name: 'teacher-create-quiz',
        component: () => import('@/pages/shared/CreateQuiz.vue')
      },
      {
        path: 'lessons',
        name: 'teacher-lessons',
        component: () => import('@/pages/teacher/TeacherLessons.vue')
      },
      {
        path: 'profile',
        name: 'teacher-profile',
        component: () => import('@/pages/teacher/TeacherProfil.vue')
      } 
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
});

//Implementation of Global Guard
// Check authentication and authorization required before each request middleware
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiredAuth;
  const requiredRole = to.meta.requiredRole;

  if (requiresAuth) {
    const authenticated = await isAuthenticated();
    if (!authenticated.status) {
      console.log("Authentication required!");
      // route to the login page
      return next({ path: "/auth/login" });
      // toastify authentication required
    } else if (requiredRole && !hasRole(requiredRole, authenticated.user)) {
      // route to the forbidden page or route to home and throw a toast message
      console.log("Forbidden route for this user");
      return next({ path: "/" });
    }
  }

  // Reset setting

  return next();
});

const isAuthenticated = async () => {
  let user = store.getters["auth/getUser"];
  if (!user) {
    await store.dispatch("auth/getMe").catch((err) => {
      console.log(err.message);
    });
    user = store.getters["auth/getUser"];
    if (!user) return { status: false };
  }
  return { status: true, user };
};

const hasRole = (role, user) => {
  return user.role === role;
};

export default router 