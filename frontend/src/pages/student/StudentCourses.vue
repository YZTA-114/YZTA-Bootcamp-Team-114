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
    <template #breadcrumb>
      <span>Dersler</span>
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #sidebar-classroom-dropdown>
      <ClassroomDropdown />
    </template>

    <template #content>
      <div>
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Derslerim</h1>
            <p class="welcome-subtitle">Kayıtlı olduğun dersleri ve detaylarını burada görebilirsin.</p>
          </div>
          <div class="welcome-actions">
            <!-- İsterseniz buraya buton ekleyebilirsiniz -->
          </div>
        </div>
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab" :class="['tab', { active: activeTab === tab }]" @click="activeTab = tab">
            {{ tab }}
          </button>
        </div>
        <div class="courses-list">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <h3>{{ course.name }}</h3>
            <p>Öğretmen: {{ course.teacher }}</p>
            <div class="progress-bar">
              <div :style="{ width: course.progress + '%' }" class="progress"></div>
            </div>
            <p>Sonraki Ders: {{ course.nextLesson }}</p>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import ClassroomDropdown from '@/components/dashboard/ClassroomDropdown.vue'
import { useNavigation } from '@/composables/useNavigation'

const userName = ref('Muhammet')
const userRole = ref('student')
const userAvatar = ref('/src/assets/images/default-avatar.png')
const currentPage = ref('Dersler')
const notificationCount = ref(3)

// Navigation
const { navItems, isSidebarCollapsed } = useNavigation(userRole)

// Course data
const courses = ref([
  {
    id: 1,
    name: 'Matematik',
    teacher: 'Ahmet Hoca',
    progress: 75,
    nextLesson: '2024-03-20 14:30'
  }
])

// Methods
const handleLogout = () => {
  // Implement logout logic
}

const handleProfile = () => {
  // Navigate to profile
}

const handleSettings = () => {
  // Navigate to settings
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';
// KOYU TEMA OVERRIDES
body, .student-courses-page, .welcome-section, .courses-list, .course-card, .course-card-img, .course-card-content {
  background: #000 !important;
  color: #fff !important;
}

.welcome-section {
  background: $orange !important;
  color: #fff !important;
}

.welcome-title, .welcome-subtitle {
  color: #fff !important;
}

.tabs {
  background: transparent !important;
  .tab {
    color: #e67e22 !important;
    background: none !important;
    &.active {
      color: #fff !important;
      border-bottom: 2.5px solid #e67e22 !important;
    }
  }
}

.courses-list {
  .course-card {
    background: #111 !important;
    color: #fff !important;
    border: 1px solid #222 !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
    .course-card-img {
      background: #111 !important;
    }
    .course-card-content {
      background: #111 !important;
      color: #fff !important;
      h3, .course-desc, .course-date {
        color: #fff !important;
      }
      .course-tag {
        background: #222 !important;
        color: #fff !important;
        border: 1px solid #e67e22 !important;
      }
      .view-more {
        background: #e67e22 !important;
        color: #fff !important;
      }
      .view-more:hover {
        background: #ca6f1e !important;
      }
    }
  }
}
.sidebar-classroom-dropdown {
  position: relative;
  margin-bottom: 18px;
  padding: 0 16px;
  font-family: inherit;
  &.modern-dropdown {
    .dropdown-selected {
      font-size: 1.1rem;
      font-weight: 600;
      background: #232323;
      color: #fff;
      padding: 14px 18px;
      border-radius: 10px;
      width: 100%;
      min-width: 180px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1.5px solid $orange;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      transition: border 0.2s;
    }
    .dropdown-selected:hover, .dropdown-selected:focus {
      border: 1.5px solid darken($orange, 10%);
    }
    .dropdown-selected-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dropdown-arrow {
      margin-left: 10px;
      font-size: 1.1rem;
      transition: transform 0.2s;
      color: #fff;
      &.open {
        transform: rotate(180deg);
      }
    }
    .dropdown-list {
      position: absolute;
      top: 110%;
      left: 0;
      right: 0;
      background: #232323;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);
      z-index: 20;
      width: 100%;
      min-width: 180px;
      padding-bottom: 8px;
      border: 1.5px solid $orange;
      animation: fadeIn 0.18s;
    }
    .dropdown-header {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      padding: 14px 18px 6px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: #232323;
    }
    .dropdown-search-wrapper {
      padding: 8px 18px 0 18px;
    }
    .dropdown-search {
      width: 100%;
      padding: 7px 12px;
      border-radius: 7px;
      border: 1.2px solid rgba(255,255,255,0.1);
      background: #232323;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
    }
    .dropdown-search:focus {
      border: 1.2px solid rgba(255,255,255,0.2);
    }
    .dropdown-items {
      max-height: 220px;
      overflow-y: auto;
      margin-top: 4px;
    }
    .dropdown-item {
      padding: 12px 18px;
      font-size: 1rem;
      color: #fff;
      cursor: pointer;
      text-align: left;
      border-radius: 7px;
      margin: 2px 8px;
      transition: background 0.15s, color 0.15s;
    }
    .dropdown-item.selected, .dropdown-item:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .dropdown-footer {
      padding: 8px 18px 12px 18px;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 4px;
      display: flex;
      justify-content: flex-end;
      background: #232323;
      border-radius: 0 0 12px 12px;
    }
    .join-class-btn {
      width: 100%;
      padding: 10px 16px;
      background: $orange;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      &:hover {
        background: darken($orange, 10%);
        transform: translateY(-1px);
      }
      &:active {
        transform: translateY(0);
      }
    }
    .dropdown-empty {
      padding: 16px 18px;
      color: #888;
      font-size: 1rem;
      text-align: center;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
}

.welcome-section {
  background: $orange;
  color: $white;
  padding: $space-xl;
  border-radius: 12px;
  margin-bottom: $space-l;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: $font-family-primary-regular;
  .welcome-content {
    .welcome-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      font-family: $font-family-primary-medium;
      margin: 0 0 $space-xs 0;
    }
    .welcome-subtitle {
      font-size: $font-size-m;
      font-family: $font-family-primary-regular;
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
      font-family: $font-family-primary-medium;
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

.tabs {
  display: flex;
  gap: $space-m;
  margin-bottom: $space-l;
  .tab {
    background: none;
    border: none;
    font-size: $font-size-m;
    font-weight: $font-weight-semi-bold;
    color: $orange;
    padding: 0 0 $space-3xs 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    font-family: $font-family-primary-medium;
    &.active {
      color: $grey;
      border-bottom: 2.5px solid $orange;
      font-weight: $font-weight-bold;
    }
  }
}

.courses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.course-card {
  background: #232323;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: #fff;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  p {
    color: #888;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-bottom: 15px;
    overflow: hidden;

    .progress {
      height: 100%;
      background: $orange;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
}
</style> 