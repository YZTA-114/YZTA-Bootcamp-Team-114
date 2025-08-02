import { ref, computed } from 'vue'
import { teacherNavigation, studentNavigation } from '@/config/navigation'

export function useNavigation(userRole) {
  const isSidebarCollapsed = ref(false)

  const navItems = computed(() => {
    return userRole.value === 'teacher' ? teacherNavigation : studentNavigation
  })

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  return {
    navItems,
    isSidebarCollapsed,
    toggleSidebar
  }
} 