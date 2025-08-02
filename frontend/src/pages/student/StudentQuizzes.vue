<template>
  <DashboardLayout
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #breadcrumb>
      <span>Quizler</span>
    </template>
    <template #sidebar-classroom-dropdown>
              <ClassroomDropdown />
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    <template #content>
      <div class="student-quizzes-page">
        <div class="quizzes-header-block">
          <h1>Quizlerim</h1>
        </div>
        <div
          class="quiz-table-controls"
          style="
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            align-items: center;
          "
        >
          <input
            v-model="search"
            placeholder="Quiz adı ile arayın..."
            class="quiz-search-input"
          />

          <!-- Course Dropdown (Tüm Dersler) -->
          <div class="filter-dropdown">
            <button
              @click="toggleCourseDropdown"
              class="filter-dropdown-btn"
              :class="{ active: showCourseDropdown }"
            >
              <div class="filter-btn-content">
                <svg
                  class="filter-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
                <span class="filter-text">{{
                  selectedCourse || "Tüm Dersler"
                }}</span>
              </div>
              <svg
                class="dropdown-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            <div v-if="showLessonDropdown" class="filter-dropdown-menu">
              <div class="dropdown-header">
                <h4>Ders Seçin</h4>
                <button
                  class="close-dropdown-btn"
                  @click="toggleLessonDropdown"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div class="dropdown-options">
                <button
                  @click="selectLesson('')"
                  class="dropdown-option"
                  :class="{ selected: selectedLesson === '' }"
                >
                  <span>Tüm Dersler</span>
                  <svg
                    v-if="selectedLesson === ''"
                    class="check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
                <button
                  v-for="lesson in lessons"
                  :key="lesson"
                  @click="selectLesson(lesson)"
                  class="dropdown-option"
                  :class="{ selected: selectedLesson === lesson }"
                >
                  <span>{{ lesson }}</span>
                  <svg
                    v-if="selectedLesson === lesson"
                    class="check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Status Dropdown (Tüm Durumlar) -->
          <div class="filter-dropdown">
            <button
              @click="toggleStatusDropdown"
              class="filter-dropdown-btn"
              :class="{ active: showStatusDropdown }"
            >
              <div class="filter-btn-content">
                <svg
                  class="filter-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
                </svg>
                <span class="filter-text">{{ statusLabel }}</span>
              </div>
              <svg
                class="dropdown-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            <div v-if="showStatusDropdown" class="filter-dropdown-menu">
              <div class="dropdown-header">
                <h4>Durum Seçin</h4>
                <button
                  class="close-dropdown-btn"
                  @click="toggleStatusDropdown"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <router-link
            class="quiz-add-btn"
            :to="{ name: 'student-create-quiz' }"
            >+ Yeni Quiz</router-link
          >
        </div>
        <div class="quiz-table-wrapper">
          <table class="quiz-table">
            <thead>
              <tr>
                <th>Quiz Adı</th>
                <th>Ders</th>
                <th>Soru Sayısı</th>
                <th>Durum</th>
                <th>Sonuç</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quiz in filteredQuizzes" :key="quiz.id">
                <td>{{ quiz?.name }}</td>
                <td>{{ quiz?.lesson.name }}</td>
                <td>{{ quiz?.questions.length }}</td>
                <td>
                  <span :class="['quiz-status', quiz.status]">
                    {{ statusText(quiz.status) }}
                  </span>
                </td>
                <td>{{ quiz.result }}</td>
                <td>{{ quiz.startDate }}</td>
                <td>{{ quiz.endDate }}</td>
                <td>
                  <button class="quiz-action-btn">Detay</button>
                  <button
                    v-if="
                      quiz.status === 'not_started' ||
                      quiz.status === 'in_progress'
                    "
                    class="quiz-action-btn"
                  >
                    Başla
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardNav from "@/components/dashboard/DashboardNav.vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { useNavigation } from "@/composables/useNavigation";
import ClassroomDropdown from '@/components/dashboard/ClassroomDropdown.vue';

const toast = useToast();
const store = useStore();

const router = useRouter();
const currentPage = ref("Quizlerim");
const notificationCount = ref(3);

const user = computed(() => store.getters['auth/getUser']);
const userRole = computed(() => user.value?.role || 'student');

// Navigation
const { navItems, isSidebarCollapsed } = useNavigation(userRole);

const currentClassroom = computed(() => store.getters["classroom/getCurrentClassroom"]);
const quizzes = computed(() => store.getters["quiz/getQuizzes"]);

const handleLogout = () => router.push("/auth/login");
const handleProfile = () => router.push("/student/profile");
const handleSettings = () => router.push("/student/settings");

// Watch for classroom changes and fetch quizzes
watch(currentClassroom, async (newClassroom) => {
  if (newClassroom?._id) {
    try {
      await store.dispatch("quiz/fetchClassroomQuizzes", newClassroom._id);
      toast.success("Quizler başarıyla yüklendi");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  }
}, { immediate: true });

const search = ref("");
const selectedLesson = ref("");

const lessons = computed(() => [
  ...new Set(quizzes.value.map((q) => q.lesson)),
]);
const filteredQuizzes = computed(() =>
  quizzes.value.filter(
    (q) =>
      q.name.toLowerCase().includes(search.value.toLowerCase()) &&
      (selectedLesson.value === "" || q.lesson === selectedLesson.value)
  )
);

const showLessonDropdown = ref(false);
const showStatusDropdown = ref(false);
const toggleLessonDropdown = () => {
  showLessonDropdown.value = !showLessonDropdown.value;
  showStatusDropdown.value = false;
};
const selectLesson = (lesson) => {
  selectedLesson.value = lesson;
  showLessonDropdown.value = false;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/custom/_variable.scss";

.student-quizzes-page {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 32px;
}
.quiz-table-wrapper {
  background: #111;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: 24px;
}
.quiz-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}
.quiz-table th,
.quiz-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #222;
  text-align: left;
}
.quiz-table th {
  background: #181818;
  color: #fff;
  font-weight: 700;
}
.quiz-table tr:last-child td {
  border-bottom: none;
}
.quiz-search-input,
.quiz-filter-select {
  background: #181818;
  color: #fff;
  border: 1.5px solid #333;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
}
.quiz-search-input::placeholder {
  color: #aaa;
}
.quiz-add-btn {
  background: #e67e22;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.quiz-add-btn:hover {
  background: #ca6f1e;
}
.quiz-status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.95em;
  font-weight: 600;
}
.quiz-status.completed {
  background: #27ae60;
  color: #fff;
}
.quiz-status.in_progress {
  background: #f1c40f;
  color: #222;
}
.quiz-status.not_started {
  background: #7f8c8d;
  color: #fff;
}
.quiz-action-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  margin-right: 6px;
  font-size: 0.95em;
  cursor: pointer;
  transition: background 0.2s;
}
.quiz-action-btn:hover {
  background: #e67e22;
  color: #fff;
}
.quizzes-header-block {
  background: $orange;
  color: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba($orange, 0.1);
  display: flex;
  align-items: flex-start;
  h1 {
    color: #fff;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
  }
}

.filter-dropdown {
  position: relative;
  margin-right: 12px;
  &.active .filter-dropdown-btn {
    border-color: $orange;
    background: #232323;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.filter-dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #181818;
  border: 1.5px solid #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 180px;
  min-width: 180px;
  &:hover {
    border-color: $orange;
  }
  .filter-btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
    .filter-icon {
      width: 20px;
      height: 20px;
      color: #888;
    }
    .filter-text {
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
    }
  }
  .dropdown-arrow {
    width: 20px;
    height: 20px;
    color: #888;
    transition: transform 0.2s;
    &.open {
      transform: rotate(180deg);
    }
  }
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #232323;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  z-index: 10;
  border: 1.5px solid $orange;
  animation: fadeIn 0.18s;
  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: #232323;
    h4 {
      margin: 0;
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
    }
    .close-dropdown-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      svg {
        width: 20px;
        height: 20px;
        color: #888;
      }
    }
  }
  .dropdown-options {
    max-height: 220px;
    overflow-y: auto;
    padding: 8px 0;
  }
  .dropdown-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    font-size: 1rem;
    color: #fff;
    cursor: pointer;
    border-radius: 7px;
    margin: 2px 8px;
    transition: background 0.15s, color 0.15s;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    &.selected {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: 600;
    }
    .check-icon {
      width: 20px;
      height: 20px;
      color: $orange;
      opacity: 0;
      transition: opacity 0.2s;
    }
    &.selected .check-icon {
      opacity: 1;
    }
  }
}
</style>
