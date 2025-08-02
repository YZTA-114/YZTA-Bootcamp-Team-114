<template>
  <DashboardLayout
    :user-name="'John Doe'"
    :user-role="'Student'"
    :user-avatar="'/default-avatar.png'"
    :current-page="'Quiz Report'"
    :notification-count="0"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
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
import { useNavigation } from '@/composables/useNavigation'

const userRole = ref('student')
const { navItems, isSidebarCollapsed } = useNavigation(userRole)
</script>

<style scoped>
/* Ek stil gerekirse buraya ekleyebilirsiniz */
</style>
