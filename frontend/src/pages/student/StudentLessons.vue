<template>
  <DashboardLayout
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
      <ClassroomDropdown @classroom-selected="handleClassroomChange" />
    </template>

    <template #content>
      <div>
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Derslerim</h1>
            <p class="welcome-subtitle">Kayıtlı olduğun dersleri ve detaylarını burada görebilirsin.</p>
          </div>
          <div class="welcome-actions">
            <!-- Actions if needed -->
          </div>
        </div>

        <!-- No Classroom Selected Message -->
        <div v-if="!selectedClassroom" class="no-classroom-message">
          <ri-information-line class="info-icon" />
          <p>Lütfen ders listesini görmek için bir sınıf seçin.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Dersler yükleniyor...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <ri-error-warning-line class="error-icon" />
          <p>{{ error }}</p>
          <button class="btn btn-secondary" @click="fetchLessons">Tekrar Dene</button>
        </div>

        <div v-else>
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab" 
              :class="['tab', { active: activeTab === tab }]" 
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>

          <!-- No Lessons Message -->
          <div v-if="!lessons.length" class="no-lessons-message">
            <ri-book-line class="empty-icon" />
            <p>Bu sınıfta henüz ders bulunmuyor.</p>
          </div>

          <!-- Lessons Grid -->
          <div v-else class="lessons-list">
            <div v-for="lesson in filteredLessons" :key="lesson._id" class="lesson-card">
              <h3>{{ lesson.name }}</h3>
              <p class="lesson-info">
                <span class="info-label">Oluşturulma:</span>
                {{ formatDate(lesson.createdAt) }}
              </p>
              <p class="lesson-info">
                <span class="info-label">Son Güncelleme:</span>
                {{ formatDate(lesson.updatedAt) }}
              </p>
              <div class="lesson-footer">
                <button class="btn btn-primary" @click="viewLessonDetails(lesson)">
                  Detayları Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'
import ClassroomDropdown from '@/components/dashboard/ClassroomDropdown.vue'
import { useNavigation } from '@/composables/useNavigation'

// Store and Router
const store = useStore()
const router = useRouter()

// User data
const currentPage = ref('Dersler')
const notificationCount = ref(3)

// Navigation
const { navItems, isSidebarCollapsed } = useNavigation('student');

// State
const loading = ref(false)
const error = ref(null)
const activeTab = ref('Tüm Dersler')
const tabs = ['Tüm Dersler', 'Devam Eden', 'Tamamlanan']

// Store getters
const lessons = computed(() => store.getters['lesson/getLessons'])
const selectedClassroom = computed(() => store.getters['classroom/getCurrentClassroom'])

// Filtered lessons based on active tab
const filteredLessons = computed(() => {
  if (activeTab.value === 'Tüm Dersler') {
    return lessons.value
  }
  // Add filtering logic for other tabs if needed
  return lessons.value
})

// Methods
const handleClassroomChange = async (classroom) => {
  if (classroom) {
    loading.value = true
    error.value = null
    try {
      await store.dispatch('lesson/fetchClassroomLessons', classroom._id)
    } catch (err) {
      error.value = err.message || 'Dersler yüklenirken bir hata oluştu'
    } finally {
      loading.value = false
    }
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const viewLessonDetails = (lesson) => {
  // TODO: Implement lesson details view
  console.log('View lesson details:', lesson)
}

const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/student/profile')
}

const handleSettings = () => {
  router.push('/student/settings')
}

onMounted(() => {
  if (selectedClassroom.value) {
    handleClassroomChange(selectedClassroom.value);
  }
});

watch(selectedClassroom, (newVal) => {
  if (newVal) {
    handleClassroomChange(newVal);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

// KOYU TEMA OVERRIDES
body, .student-lessons-page, .welcome-section, .lessons-list, .lesson-card {
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
}

.tabs {
  display: flex;
  gap: $space-m;
  margin-bottom: $space-l;
  padding: 0 $space-m;

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

.no-classroom-message,
.no-lessons-message,
.loading-state,
.error-state {
  text-align: center;
  padding: $space-xl;
  background: #111;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba($black, 0.1);
  margin: 0 $space-m;
  border: 2px solid rgba($orange, 0.5);

  .info-icon,
  .empty-icon,
  .error-icon {
    font-size: 48px;
    color: $orange;
    margin-bottom: $space-m;
  }

  p {
    font-size: $font-size-m;
    color: $white;
    margin-bottom: $space-m;
  }
}

.loading-state {
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba($orange, 0.1);
    border-left-color: $orange;
    border-radius: 50%;
    margin: 0 auto $space-m;
    animation: spin 1s linear infinite;
  }
}

.lessons-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-m;
  padding: $space-m;

  .lesson-card {
    background: #111;
    border-radius: 12px;
    padding: $space-m;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba($orange, 0.5);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }

    h3 {
      color: $white;
      margin-bottom: $space-m;
      font-size: $font-size-l;
      font-weight: $font-weight-semi-bold;
    }

    .lesson-info {
      color: rgba($white, 0.7);
      margin-bottom: $space-s;
      font-size: $font-size-s;

      .info-label {
        color: $orange;
        font-weight: $font-weight-semi-bold;
        margin-right: $space-xs;
      }
    }

    .lesson-footer {
      margin-top: $space-m;
      display: flex;
      justify-content: flex-end;

      .btn {
        background: $orange;
        color: $white;
        border: none;
        padding: $space-s $space-m;
        border-radius: 8px;
        font-weight: $font-weight-semi-bold;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: darken($orange, 10%);
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 