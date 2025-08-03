<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>

    <template #sidebar-classroom-dropdown>
      <ClassroomDropdown @classroom-selected="handleClassroomChange" />
    </template>

    <template #content>
      <div class="teacher-lessons">
        <!-- Header Section -->
        <div class="header-section">
          <h1 class="page-title">Dersler</h1>
          <button class="btn btn-primary" @click="openCreateLessonModal" v-if="selectedClassroom">
            <ri-add-line />
            Yeni Ders Ekle
          </button>
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

        <!-- Lessons List -->
        <div v-else class="lessons-container">
          <!-- No Lessons Message -->
          <div v-if="!lessons.length" class="no-lessons-message">
            <ri-book-line class="empty-icon" />
            <p>Bu sınıfta henüz ders bulunmuyor.</p>
            <button class="btn btn-primary" @click="openCreateLessonModal">
              İlk Dersi Oluştur
            </button>
          </div>

          <!-- Lessons Grid -->
          <div v-else class="lessons-grid">
            <div v-for="lesson in lessons" :key="lesson._id" class="lesson-card">
              <div class="lesson-header">
                <h3 class="lesson-title">{{ lesson.name }}</h3>
                <div class="lesson-actions">
                  <button class="action-btn edit" @click="openEditLessonModal(lesson)">
                    <ri-edit-line />
                  </button>
                  <button class="action-btn delete" @click="confirmDeleteLesson(lesson)">
                    <ri-delete-bin-line />
                  </button>
                </div>
              </div>
              <div class="lesson-info">
                <p class="lesson-date">Oluşturulma: {{ formatDate(lesson.createdAt) }}</p>
                <p class="lesson-date">Güncellenme: {{ formatDate(lesson.updatedAt) }}</p>
              </div>
              <div class="lesson-footer">
                <button class="btn btn-secondary" @click="viewLessonDetails(lesson)">
                  Detayları Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Lesson Modal -->
        <BaseModal v-if="showLessonModal" @close="closeLessonModal">
          <template #header>
            <h2>{{ isEditing ? 'Dersi Düzenle' : 'Yeni Ders Oluştur' }}</h2>
          </template>

          <template #body>
            <form @submit.prevent="handleLessonSubmit" class="lesson-form">
              <div class="form-group">
                <label for="lessonName">Ders Adı</label>
                <input
                  id="lessonName"
                  v-model="lessonForm.name"
                  type="text"
                  class="form-control"
                  required
                  placeholder="Ders adını girin"
                />
              </div>
            </form>
          </template>

          <template #footer>
            <button class="btn btn-secondary" @click="closeLessonModal">İptal</button>
            <button class="btn btn-primary" @click="handleLessonSubmit" :disabled="isSubmitting">
              {{ isEditing ? 'Güncelle' : 'Oluştur' }}
            </button>
          </template>
        </BaseModal>

        <!-- Delete Confirmation Modal -->
        <BaseModal v-if="showDeleteModal" @close="closeDeleteModal">
          <template #header>
            <h2>Dersi Sil</h2>
          </template>

          <template #body>
            <p>{{ selectedLesson?.name }} dersini silmek istediğinizden emin misiniz?</p>
            <p class="warning-text">Bu işlem geri alınamaz!</p>
          </template>

          <template #footer>
            <button class="btn btn-secondary" @click="closeDeleteModal">İptal</button>
            <button class="btn btn-danger" @click="handleDeleteLesson" :disabled="isSubmitting">
              Sil
            </button>
          </template>
        </BaseModal>
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
import BaseModal from '@/components/shared/BaseModal.vue'
import { useNavigation } from '@/composables/useNavigation'

// Store and Router
const store = useStore()
const router = useRouter()

// User and Navigation
const user = computed(() => store.getters['auth/getUser'])
const userRole = computed(() => user.value?.role || 'teacher')
const currentPage = ref('Dersler')
const notificationCount = ref(0)
const { navItems, isSidebarCollapsed } = useNavigation(userRole)

// State
const loading = ref(false)
const error = ref(null)
const lessons = computed(() => store.getters['lesson/getLessons'])
const selectedClassroom = computed(() => store.getters['classroom/getCurrentClassroom'])
const showLessonModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedLesson = ref(null)
const lessonForm = ref({
  name: ''
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

const openCreateLessonModal = () => {
  isEditing.value = false
  lessonForm.value = { name: '' }
  showLessonModal.value = true
}

const openEditLessonModal = (lesson) => {
  isEditing.value = true
  selectedLesson.value = lesson
  lessonForm.value = { name: lesson.name }
  showLessonModal.value = true
}

const closeLessonModal = () => {
  showLessonModal.value = false
  lessonForm.value = { name: '' }
  selectedLesson.value = null
  isEditing.value = false
}

const handleLessonSubmit = async () => {
  if (!lessonForm.value.name.trim()) return

  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await store.dispatch('lesson/updateLesson', {
        id: selectedLesson.value._id,
        lessonData: lessonForm.value
      })
    } else {
      await store.dispatch('lesson/createLesson', {
        classroomId: selectedClassroom.value._id,
        lessonData: lessonForm.value
      })
    }
    closeLessonModal()
  } catch (err) {
    error.value = err.message || 'Ders kaydedilirken bir hata oluştu'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteLesson = (lesson) => {
  selectedLesson.value = lesson
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedLesson.value = null
}

const handleDeleteLesson = async () => {
  if (!selectedLesson.value) return

  isSubmitting.value = true
  try {
    await store.dispatch('lesson/deleteLesson', selectedLesson.value._id)
    closeDeleteModal()
  } catch (err) {
    error.value = err.message || 'Ders silinirken bir hata oluştu'
  } finally {
    isSubmitting.value = false
  }
}

const viewLessonDetails = (lesson) => {
  // TODO: Implement lesson details view
  console.log('View lesson details:', lesson)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Navigation Methods
const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/teacher/profile')
}

const handleSettings = () => {
  router.push('/teacher/settings')
}

// Lifecycle
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

.teacher-lessons {
  padding: $space-m;

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-l;

    .page-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $black;
      margin: 0;
    }
  }

  .no-classroom-message,
  .no-lessons-message,
  .loading-state,
  .error-state {
    text-align: center;
    padding: $space-xl;
    background: $white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba($black, 0.1);

    .info-icon,
    .empty-icon,
    .error-icon {
      font-size: 48px;
      color: $orange;
      margin-bottom: $space-m;
    }

    p {
      font-size: $font-size-m;
      color: $black;
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

  .error-state {
    .error-icon {
      color: $red;
    }
  }

  .lessons-container {
    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: $space-m;
    }

    .lesson-card {
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba($black, 0.1);
      padding: $space-m;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba($black, 0.15);
      }

      .lesson-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: $space-m;

        .lesson-title {
          font-size: $font-size-m;
          font-weight: $font-weight-semi-bold;
          color: $black;
          margin: 0;
        }

        .lesson-actions {
          display: flex;
          gap: $space-xs;

          .action-btn {
            background: none;
            border: none;
            padding: $space-xs;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s ease;

            &.edit {
              color: $orange;
              &:hover {
                background: rgba($orange, 0.1);
              }
            }

            &.delete {
              color: $red;
              &:hover {
                background: rgba($red, 0.1);
              }
            }
          }
        }
      }

      .lesson-info {
        margin-bottom: $space-m;

        .lesson-date {
          font-size: $font-size-s;
          color: rgba($black, 0.6);
          margin: 0 0 $space-xs 0;
        }
      }

      .lesson-footer {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .lesson-form {
    .form-group {
      margin-bottom: $space-m;

      label {
        display: block;
        font-size: $font-size-s;
        font-weight: $font-weight-semi-bold;
        color: $black;
        margin-bottom: $space-xs;
      }

      .form-control {
        width: 100%;
        padding: $space-s;
        border: 1px solid rgba($black, 0.2);
        border-radius: 6px;
        font-size: $font-size-s;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: $orange;
        }
      }
    }
  }

  .warning-text {
    color: $red;
    font-weight: $font-weight-semi-bold;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Dark theme overrides
body[data-theme="dark"] {
  .teacher-lessons {
    background: #000;
    color: #fff;

    .page-title {
      color: #fff;
    }

    .lesson-card {
      background: #111;
      border: 2px solid rgba($orange, 0.5);

      .lesson-title {
        color: #fff;
      }

      .lesson-info {
        .lesson-date {
          color: rgba(#fff, 0.6);
        }
      }
    }

    .no-classroom-message,
    .no-lessons-message,
    .loading-state,
    .error-state {
      background: #111;
      border: 2px solid rgba($orange, 0.5);

      p {
        color: #fff;
      }
    }

    .lesson-form {
      label {
        color: #fff;
      }

      .form-control {
        background: #111;
        border-color: rgba(#fff, 0.2);
        color: #fff;

        &:focus {
          border-color: $orange;
        }
      }
    }
  }
}
</style>