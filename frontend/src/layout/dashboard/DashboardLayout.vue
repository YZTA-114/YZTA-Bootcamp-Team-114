<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo" v-if="!isSidebarCollapsed">
          <img src="@/assets/images/logo.png" alt="Logo" />
        </div>

        <button 
          v-if="!isSidebarCollapsed"
          class="sidebar-toggle"
          @click="toggleSidebar"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <div class="button-box">
            <svg class="button-elem" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </div>
        </button>
      </div>
      
      <div v-if="!isSidebarCollapsed" class="sidebar-dropdown-section">
        <slot name="sidebar-classroom-dropdown"></slot>
      </div>
      <nav class="sidebar-nav">
        <button 
          v-if="isSidebarCollapsed"
          class="sidebar-toggle collapsed-nav-toggle"
          @click="toggleSidebar"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <div class="button-box">
            <svg class="button-elem" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </div>
        </button>
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
              <span>Dashboard</span>
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
              <div class="notification-dropdown" v-if="isNotificationMenuOpen">
                <div class="dropdown-header">
                  <h3>Bildirimler</h3>
                </div>
                <div class="notification-item">
                  <div class="notification-icon">📚</div>
                  <div class="notification-content">
                    <div class="notification-title">Yeni Quiz</div>
                    <div class="notification-text">Matematik dersinde yeni quiz</div>
                    <div class="notification-time">5 dk önce</div>
                  </div>
                </div>
                <div class="notification-item">
                  <div class="notification-icon">📝</div>
                  <div class="notification-content">
                    <div class="notification-title">Ödev Tamamlandı</div>
                    <div class="notification-text">Haftalık ödeviniz kontrol edildi</div>
                    <div class="notification-time">1 saat önce</div>
                  </div>
                </div>
                <div class="notification-item">
                  <div class="notification-icon">🎯</div>
                  <div class="notification-content">
                    <div class="notification-title">Başarı Rozeti</div>
                    <div class="notification-text">10 quiz tamamladınız!</div>
                    <div class="notification-time">2 saat önce</div>
                  </div>
                </div>
              </div>
              <button class="message-btn" @click="toggleMessages">
                <ri-message-line />
                <span class="message-badge" v-if="messageCount > 0">{{ messageCount }}</span>
              </button>
              <div class="message-dropdown" v-if="isMessageMenuOpen">
                <div class="dropdown-header">
                  <h3>Mesajlar</h3>
                </div>
                <div class="message-item">
                  <div class="message-avatar">A</div>
                  <div class="message-content">
                    <div class="message-sender">Ahmet Öğretmen</div>
                    <div class="message-text">Yeni quiz eklendi!</div>
                    <div class="message-time">2 saat önce</div>
                  </div>
                </div>
                <div class="message-item">
                  <div class="message-avatar">M</div>
                  <div class="message-content">
                    <div class="message-sender">Matematik Sınıfı</div>
                    <div class="message-text">Haftalık ödev kontrol</div>
                    <div class="message-time">1 gün önce</div>
                  </div>
                </div>
                <div class="message-item">
                  <div class="message-avatar">S</div>
                  <div class="message-content">
                    <div class="message-sender">Sistem</div>
                    <div class="message-text">Yeni doküman yüklendi</div>
                    <div class="message-time">3 gün önce</div>
                  </div>
                </div>
              </div>
              <div class="user-menu">
                <button class="user-menu-toggle" @click="toggleUserMenu">
                  <img :src="userAvatar" :alt="userName" />
                  <ri-arrow-down-s-line />
                </button>
                <div class="user-dropdown" v-if="isUserMenuOpen">
                  <a href="#" @click="goToProfile">
                    <ri-user-line />
                    Profil
                  </a>
                  <a href="#" @click="goToSettings">
                    <ri-settings-line />
                    Ayarlar
                  </a>
                  <hr />
                  <a href="#" @click="logout">
                    <ri-logout-box-line />
                    Çıkış Yap
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
import { ref, onMounted, onUnmounted, defineProps, defineEmits, defineExpose, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification';

const toast = useToast()

const store = useStore()

const user = computed(() => store.getters['auth/getUser'])
const classrooms = computed(() => store.getters['classroom/getClassrooms'])

// Computed user info
const userName = computed(() => user.value?.userProfile.firstName + ' ' + user.value?.userProfile.lastName || 'User')
const userRole = computed(() => user.value?.role === 'teacher' ? 'Öğretmen' : 'Öğrenci')
const userAvatar = computed(() => user.value?.userProfile.avatar || '/default-avatar.png')

// Props
defineProps({
  currentPage: {
    type: String,
    default: 'Dashboard'
  },
  notificationCount: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['logout', 'profile', 'settings'])

const SIDEBAR_COLLAPSE_KEY = 'dashboardSidebarCollapsed'

const isSidebarCollapsed = ref(true)
const isUserMenuOpen = ref(false)
const isNotificationMenuOpen = ref(false)
const isMessageMenuOpen = ref(false)
const isMobile = ref(false)

// Methods
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem(SIDEBAR_COLLAPSE_KEY, isSidebarCollapsed.value ? '1' : '0')
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
}

const toggleNotifications = () => {
  isNotificationMenuOpen.value = !isNotificationMenuOpen.value
  isMessageMenuOpen.value = false
  isUserMenuOpen.value = false
}

const toggleMessages = () => {
  isMessageMenuOpen.value = !isMessageMenuOpen.value
  isNotificationMenuOpen.value = false
  isUserMenuOpen.value = false
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
  // Sidebar durumunu localStorage'dan yükle
  const saved = localStorage.getItem(SIDEBAR_COLLAPSE_KEY)
  if (saved !== null) {
    isSidebarCollapsed.value = saved === '1'
  }
})

onBeforeMount(async () => {
    await store.dispatch('classroom/getMyClassrooms', user.value._id).then(() => {
      console.log(classrooms.value);
    }).catch((err) => {
      console.log(err);
      toast.error(err.message);
    });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose methods to parent components
defineExpose({
  toggleSidebar,
  isSidebarCollapsed
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
  background: #232323;
  color: #fff;
  width: 260px;
  min-width: 220px;
  max-width: 320px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  box-shadow: 2px 0 16px rgba(0,0,0,0.10);
  padding: 0;
  position: relative;
  z-index: 100;
  transition: width 0.3s ease;
  overflow: visible;
  
  &.sidebar-collapsed {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    overflow: visible;
  }
}

.sidebar-header {
  position: relative;
  padding: 32px 0 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border-bottom: none;
}

.logo img {
  max-width: 120px;
  height: auto;
  margin-bottom: 12px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}

.dashboard-nav .nav-link {
  border-radius: 12px;
  margin: 0 16px;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 14px 18px;
  color: #bdbdbd;
  background: none;
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  gap: 16px;
}
.dashboard-nav .nav-link .nav-icon {
  font-size: 1.35rem;
  color: #8be78b;
}
.dashboard-nav .nav-link.active,
.dashboard-nav .nav-link:hover {
  background: #181818;
  color: #fff;
}
.dashboard-nav .nav-link.active .nav-icon,
.dashboard-nav .nav-link:hover .nav-icon {
  color: #fff;
}

.sidebar-footer {
  padding: 24px 0 32px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #8be78b;
  margin-bottom: 6px;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-details {
  text-align: center;
}
.user-name {
  font-size: 1.08rem;
  font-weight: 600;
  color: #fff;
}
.user-role {
  font-size: 0.95rem;
  color: #8be78b;
  opacity: 0.85;
}

.sidebar-toggle {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 56px;
  height: 56px;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  z-index: 10;

  &:before,
  &:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 7px;
  }

  &:before {
    border: 4px solid #f0eeef;
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }

  &:after {
    border: 4px solid #96daf0;
    transform: scale(1.3);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
  }

  &:hover:before,
  &:focus:before {
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover:after,
  &:focus:after {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }

  .button-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
  }

  .button-elem {
    display: block;
    width: 20px;
    height: 20px;
    margin: 17px 18px 0 18px;
    transform: rotate(180deg);
    fill: #f0eeef;
  }

  &:hover .button-box,
  &:focus .button-box {
    transition: 0.4s;
    transform: translateX(-56px);
  }
}

.dashboard-sidebar.sidebar-collapsed {
  justify-content: flex-start !important;
  padding-bottom: 0 !important;
  
  .sidebar-footer,
  .user-info,
  .logo {
    display: none !important;
  }
  
  .sidebar-nav {
    padding: 80px 0 0 0;
  }
  
  .dashboard-nav .nav-link {
    margin: 0 8px;
    padding: 12px;
    justify-content: center;
    
    .nav-icon {
      margin: 0;
      font-size: 20px;
    }
    
    .nav-text,
    .nav-badge,
    .nav-arrow {
      display: none;
    }
  }
  
  .sidebar-toggle {
    position: relative;
    top: auto;
    right: auto;
    margin: 8px auto;
    display: block;
  }
  
  .collapsed-nav-toggle {
    position: absolute;
    top: 18px;
    right: 18px;
    margin: 0;
    display: block;
    width: 56px;
    height: 56px;
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
  background-color: #232323;
  border-bottom: 1px solid rgba(255,255,255,0.06);
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
      color: #fff;
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
        color: #fff;

        &:hover {
          background-color: rgba(255,255,255,0.1);
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

      .message-btn {
        position: relative;
        background: none;
        border: none;
        font-size: $font-size-m;
        cursor: pointer;
        padding: $space-xs;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        color: #fff;

        &:hover {
          background-color: rgba(255,255,255,0.1);
        }

        .message-badge {
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

      .notification-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #232323;
        border: 1px solid $orange;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        min-width: 300px;
        width: calc(100vw - 500px);
        max-width: 350px;
        z-index: 1000;
        margin-top: $space-xs;
        margin-right: 0;
        padding: $space-s;

        .dropdown-header {
          padding-bottom: $space-s;
          margin-bottom: $space-s;
          border-bottom: 1px solid rgba(255,255,255,0.1);

          h3 {
            color: #fff;
            font-size: $font-size-m;
            font-weight: $font-weight-semi-bold;
            margin: 0;
          }
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: $space-s;
          padding: $space-s;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: $space-xs;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.2);
          }

          &:last-child {
            margin-bottom: 0;
          }

          .notification-icon {
            font-size: 20px;
            margin-top: 2px;
          }

          .notification-content {
            flex: 1;

            .notification-title {
              font-weight: $font-weight-semi-bold;
              color: #fff;
              font-size: $font-size-s;
              margin-bottom: 2px;
            }

            .notification-text {
              color: #ccc;
              font-size: $font-size-xs;
              margin-bottom: 4px;
            }

            .notification-time {
              color: #999;
              font-size: $font-size-xxs;
            }
          }
        }
      }

      .message-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #232323;
        border: 1px solid $orange;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        min-width: 300px;
        width: calc(100vw - 500px);
        max-width: 350px;
        z-index: 1000;
        margin-top: $space-xs;
        margin-right: 0;
        padding: $space-s;

        .dropdown-header {
          padding-bottom: $space-s;
          margin-bottom: $space-s;
          border-bottom: 1px solid rgba(255,255,255,0.1);

          h3 {
            color: #fff;
            font-size: $font-size-m;
            font-weight: $font-weight-semi-bold;
            margin: 0;
          }
        }

        .message-item {
          display: flex;
          align-items: flex-start;
          gap: $space-s;
          padding: $space-s;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: $space-xs;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.2);
          }

          &:last-child {
            margin-bottom: 0;
          }

          .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #8be78b;
            color: #232323;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: $font-weight-semi-bold;
            font-size: $font-size-xs;
          }

          .message-content {
            flex: 1;

            .message-sender {
              font-weight: $font-weight-semi-bold;
              color: #fff;
              font-size: $font-size-s;
              margin-bottom: 2px;
            }

            .message-text {
              color: #ccc;
              font-size: $font-size-xs;
              margin-bottom: 4px;
            }

            .message-time {
              color: #999;
              font-size: $font-size-xxs;
            }
          }
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
            background-color: rgba(255,255,255,0.1);
          }

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid $pink;
            background: $white;
            box-shadow: 0 2px 8px rgba($black, 0.08);
            margin-right: 6px;
          }
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #232323;
          border: 1px solid $orange;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          min-width: 160px;
          z-index: 1000;
          margin-top: $space-xs;

          a {
            display: flex;
            align-items: center;
            gap: $space-s;
            padding: $space-s $space-m;
            color: #fff;
            text-decoration: none;
            font-size: $font-size-s;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            margin-bottom: $space-xs;
            transition: background-color 0.2s ease;

            &:hover {
              background-color: rgba(255,255,255,0.05);
              border-color: rgba(255,255,255,0.2);
            }

            &:last-child {
              margin-bottom: 0;
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

.collapsed-logo-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: transparent;
  min-height: 60px;
}
.collapsed-logo-img {
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
  display: block;
}


</style> 