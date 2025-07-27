<template>
  <DashboardLayout
    :user-name="'John Doe'"
    :user-role="'Student'"
    :user-avatar="'/default-avatar.png'"
    :current-page="'Quiz Report'"
    :notification-count="0"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="false" />
    </template>
    <template #content>
      <!-- Quiz raporu içeriği buraya gelecek -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import { ref } from 'vue'

const navItems = ref([
  { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: 'ri-dashboard-line' },
  { id: 'courses', label: 'Dersler', path: '/student/courses', icon: 'ri-book-line' },
  { id: 'assignments', label: 'Quizler', path: '/student/assignments', icon: 'ri-task-line' },
  { id: 'documents', label: 'Dokümanlarım', path: '/student/documents', icon: 'ri-file-text-line' },
  { id: 'calendar', label: 'Takvim', path: '/student/calendar', icon: 'ri-calendar-line' },
  { id: 'profile', label: 'Profil', path: '/student/profile', icon: 'ri-user-line' }
])
</script>

<style scoped>
/* Ek stil gerekirse buraya ekleyebilirsiniz */
</style>
