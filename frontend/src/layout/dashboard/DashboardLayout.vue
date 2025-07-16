<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="Logo" v-if="!isSidebarCollapsed" />
          
        </div>
        <button 
          class="sidebar-toggle" 
          @click="toggleSidebar"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <ri-menu-line />
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <slot name="sidebar-nav">
          <!-- Default navigation will be provided by child components -->
        </slot>
      </nav>
      
      <div class="sidebar-footer">
        <slot name="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="userAvatar" :alt="userName" />
            </div>
            <div class="user-details" v-if="!isSidebarCollapsed">
              <p class="user-name">{{ userName }}</p>
              <p class="user-role">{{ userRole }}</p>
            </div>
          </div>
        </slot>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="dashboard-main">
      <!-- Top Navigation -->
      <header class="dashboard-header">
        <div class="header-left">
          <button 
            class="mobile-sidebar-toggle" 
            @click="toggleSidebar"
            :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          >
            <ri-menu-line />
          </button>
          <div class="breadcrumb">
            <slot name="breadcrumb">
              <span>{{ currentPage }}</span>
            </slot>
          </div>
        </div>
        
        <div class="header-right">
          <slot name="header-actions">
            <div class="header-actions">
              <button class="notification-btn" @click="toggleNotifications">
                <ri-notification-line />
                <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
              </button>
              <div class="user-menu">
                <button class="user-menu-toggle" @click="toggleUserMenu">
                  <img :src="userAvatar" :alt="userName" />
                  <ri-arrow-down-s-line />
                </button>
                <div class="user-dropdown" v-if="isUserMenuOpen">
                  <a href="#" @click="goToProfile">
                    <ri-user-line />
                    Profile
                  </a>
                  <a href="#" @click="goToSettings">
                    <ri-settings-line />
                    Settings
                  </a>
                  <hr />
                  <a href="#" @click="logout">
                    <ri-logout-box-line />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </header>

      <!-- Page Content -->
      <main class="dashboard-content">
        <slot name="content">
          <router-view />
        </slot>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      class="mobile-overlay" 
      v-if="isMobile && !isSidebarCollapsed" 
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'

// Props
defineProps({
  userName: {
    type: String,
    default: 'User'
  },
  userRole: {
    type: String,
    default: 'Student'
  },
  userAvatar: {
    type: String,
    default: '/default-avatar.png'
  },
  currentPage: {
    type: String,
    default: 'Dashboard'
  },
  notificationCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['logout', 'profile', 'settings'])

// Reactive data
const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)
const isMobile = ref(false)

// Methods
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
}

const toggleNotifications = () => {
  // Handle notifications toggle
  console.log('Toggle notifications')
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const goToProfile = () => {
  isUserMenuOpen.value = false
  emit('profile')
}

const goToSettings = () => {
  isUserMenuOpen.value = false
  emit('settings')
}

const logout = () => {
  isUserMenuOpen.value = false
  emit('logout')
}

// Handle mobile responsiveness
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
}

// Lifecycle
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: $black;
}

.dashboard-sidebar {
  width: 280px;
  background: $grey;
  color: $white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  z-index: 1000;

  &.sidebar-collapsed {
    width: 70px;
  }

  .sidebar-header {
    padding: $space-m;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba($white, 0.1);

    .logo {
      img {
        height: 40px;
        width: auto;
      }
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: $white;
      font-size: $font-size-m;
      cursor: pointer;
      padding: $space-xs;
      border-radius: 4px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba($white, 0.1);
      }
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: $space-m 0;
    overflow-y: auto;
  }

  .sidebar-footer {
    padding: $space-m;
    border-top: 1px solid rgba($white, 0.1);

    .user-info {
      display: flex;
      align-items: center;
      gap: $space-s;

      .user-avatar {
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

      .user-details {
        flex: 1;
        min-width: 0;

        .user-name {
          font-size: $font-size-s;
          font-weight: $font-weight-semi-bold;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: $font-size-xs;
          opacity: 0.8;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  height: 70px;
  background-color: $white;
  border-bottom: 1px solid rgba($black, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-l;
  position: relative;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    gap: $space-m;

    .mobile-sidebar-toggle {
      display: none;
      background: none;
      border: none;
      font-size: $font-size-m;
      cursor: pointer;
      padding: $space-xs;
      border-radius: 4px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba($black, 0.05);
      }
    }

    .breadcrumb {
      font-size: $font-size-m;
      font-weight: $font-weight-semi-bold;
      color: $black;
    }
  }

  .header-right {
    .header-actions {
      display: flex;
      align-items: center;
      gap: $space-m;

      .notification-btn {
        position: relative;
        background: none;
        border: none;
        font-size: $font-size-m;
        cursor: pointer;
        padding: $space-xs;
        border-radius: 4px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba($black, 0.05);
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: $orange;
          color: $white;
          font-size: $font-size-xxs;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }
      }

      .user-menu {
        position: relative;

        .user-menu-toggle {
          display: flex;
          align-items: center;
          gap: $space-xs;
          background: none;
          border: none;
          cursor: pointer;
          padding: $space-xs;
          border-radius: 4px;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: rgba($black, 0.05);
          }

          img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: $white;
          border: 1px solid rgba($black, 0.1);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba($black, 0.1);
          min-width: 160px;
          z-index: 1000;
          margin-top: $space-xs;

          a {
            display: block;
            padding: $space-s $space-m;
            color: $black;
            text-decoration: none;
            font-size: $font-size-s;
            transition: background-color 0.2s ease;

            &:hover {
              background-color: rgba($black, 0.05);
            }

            &:first-child {
              border-radius: 8px 8px 0 0;
            }

            &:last-child {
              border-radius: 0 0 8px 8px;
            }
          }

          hr {
            margin: $space-xs 0;
            border: none;
            border-top: 1px solid rgba($black, 0.1);
          }
        }
      }
    }
  }
}

.dashboard-content {
  flex: 1;
  padding: $space-l;
  overflow-y: auto;
  background-color: $black;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($black, 0.5);
  z-index: 999;
}

// Mobile responsive styles
@media (max-width: 768px) {
  .dashboard-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &:not(.sidebar-collapsed) {
      transform: translateX(0);
    }
  }

  .dashboard-header {
    .header-left {
      .mobile-sidebar-toggle {
        display: block;
      }
    }
  }
}
</style> 