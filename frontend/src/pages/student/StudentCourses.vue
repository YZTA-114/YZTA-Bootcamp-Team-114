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
      <div class="sidebar-classroom-dropdown modern-dropdown">
        <div class="dropdown-selected" @click="dropdownOpen = !dropdownOpen">
          <span class="dropdown-selected-title">{{ selectedClassroom.name }}</span>
          <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
        </div>
        <div v-if="dropdownOpen" class="dropdown-list">
          <div class="dropdown-header">Sınıflar</div>
          <div class="dropdown-search-wrapper">
            <input type="text" v-model="classroomSearch" placeholder="Sınıf ara..." class="dropdown-search" />
          </div>
          <div class="dropdown-items">
            <div
              v-for="classroom in filteredClassrooms"
              :key="classroom.id"
              class="dropdown-item"
              :class="{ selected: classroom.id === selectedClassroom.id }"
              @click="selectClassroom(classroom)"
            >
              {{ classroom.name }}
            </div>
            <div v-if="filteredClassrooms.length === 0" class="dropdown-empty">Sonuç bulunamadı</div>
          </div>
          <div class="dropdown-footer">
            <button class="join-class-btn" @click="joinNewClass">
              <ri-add-line />
              Yeni Sınıfa Katıl
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="student-courses-redesign">
        <!-- Sol: Sekmeler ve Ders Kartları -->
        <div class="courses-main">
          <div class="courses-header-block">
            <h1 class="page-title">Derslerim</h1>
          </div>
          <div class="tabs">
            <button v-for="tab in tabs" :key="tab" :class="['tab', { active: activeTab === tab }]" @click="activeTab = tab">
              {{ tab }}
            </button>
          </div>
          <div class="courses-list">
            <div v-for="course in filteredCourses" :key="course.id" class="course-card">
              <div class="course-card-img">
                <img :src="course.image" alt="course image" />
              </div>
              <div class="course-card-content">
                <div class="course-card-header">
                  <h3>{{ course.title }}</h3>
                  <div class="course-rating">
                    <span>{{ course.rating }}</span>
                    <i class="ri-star-fill"></i>
                  </div>
                </div>
                <p class="course-desc">{{ course.desc }}</p>
                <div class="course-tags">
                  <span v-for="tag in course.tags" :key="tag" class="course-tag">{{ tag }}</span>
                </div>
                <div class="course-footer">
                  <span class="course-date">Başlangıç: {{ course.start }}</span>
                  <button class="view-more">Detay</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Sağ: Takvim ve Program -->
        <div class="courses-sidebar">
          <div class="calendar-box">
            <div class="calendar-header">
              <span>Temmuz 2021</span>
              <div class="calendar-arrows">
                <i class="ri-arrow-left-s-line"></i>
                <i class="ri-arrow-right-s-line"></i>
              </div>
            </div>
            <div class="calendar-days">
              <div v-for="day in weekDays" :key="day.label" :class="['calendar-day', { today: day.today }]">
                <span class="day-label">{{ day.label }}</span>
                <span class="day-num">{{ day.num }}</span>
                <span v-if="day.today" class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

const router = useRouter()
const userName = ref('Muhammet')
const userRole = ref('Öğrenci')
const userAvatar = ref('/default.png')
const currentPage = ref('Derslerim')
const notificationCount = ref(3)
const isSidebarCollapsed = ref(false)

const navItems = ref([
  { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: 'ri-dashboard-line' },
  { id: 'courses', label: 'Dersler', path: '/student/courses', icon: 'ri-book-line' },
  { id: 'quizzes', label: 'Quizler', path: '/student/quizzes', icon: 'ri-task-line' },
  { id: 'documents', label: 'Dökümanlar', path: '/student/documents', icon: 'ri-file-text-line' },
  { id: 'profile', label: 'Profil', path: '/student/profile', icon: 'ri-user-line' }
])

const tabs = ['Tümü', 'Aktif', 'Yaklaşan', 'Tamamlanan']
const activeTab = ref('Yaklaşan')

const courses = ref([
  {
    id: 1,
    title: 'İngilizce Dersi',
    desc: 'En popüler eğitmenlerle dil dersleri',
    tags: ['Diller'],
    rating: 4.5,
    start: '20 Temmuz',
    image: require('@/assets/images/a_dark-themed_modern_and_professional_background_smooth_gradient_transitions_in_deep_navy_and_charc_4a.png')
  },
  {
    id: 2,
    title: 'Tasarım Stratejisi',
    desc: 'Tasarım konsepti oluşturma ve doğru planlama dersi',
    tags: ['UI/UX Tasarım', 'Web Tasarım'],
    rating: 4.0,
    start: '22 Temmuz',
    image: require('@/assets/images/nk-ni-wgS7Iz0Chtg-unsplash.jpg')
  },
  {
    id: 3,
    title: 'İşletme Dersi',
    desc: 'Yeni projelerden korkmadan işinizi güvenle kurmanın yolları',
    tags: ['Pazarlama', 'Finans'],
    rating: 4.2,
    start: '26 Temmuz',
    image: require('@/assets/images/team-386673_1280.jpg')
  }
])

const filteredCourses = computed(() => {
  if (activeTab.value === 'Tümü') return courses.value
  if (activeTab.value === 'Yaklaşan') return courses.value // örnek veri
  // Diğer tablar için filtreleme eklenebilir
  return courses.value
})

const weekDays = [
  { label: 'Pzt', num: 4 },
  { label: 'Sal', num: 5 },
  { label: 'Çar', num: 6, today: true },
  { label: 'Per', num: 7 },
  { label: 'Cum', num: 8 },
  { label: 'Cmt', num: 9 },
  { label: 'Paz', num: 10 }
]

const handleLogout = () => router.push('/auth/login')
const handleProfile = () => router.push('/student/profile')
const handleSettings = () => router.push('/student/settings')

// Sınıflar dropdown state ve fonksiyonları
const classrooms = [
  { id: 1, name: 'Matematik Sınıfı' },
  { id: 2, name: 'Fizik Sınıfı' },
  { id: 3, name: 'Kimya Sınıfı' },
  { id: 4, name: 'Biyoloji Sınıfı' },
  { id: 5, name: 'Tarih Sınıfı' }
]
const selectedClassroom = ref(classrooms[0])
const dropdownOpen = ref(false)
const classroomSearch = ref('')

const filteredClassrooms = computed(() => {
  if (!classroomSearch.value) return classrooms
  return classrooms.filter(c => c.name.toLowerCase().includes(classroomSearch.value.toLowerCase()))
})

function selectClassroom(classroom) {
  selectedClassroom.value = classroom
  dropdownOpen.value = false
}

function joinNewClass() {
  // Yeni sınıfa katılma işlemi burada gerçekleştirilecek
  console.log('Yeni sınıfa katılma modalı açılacak')
  dropdownOpen.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';
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

.student-courses-redesign {
  display: flex;
  gap: $space-l;
  align-items: flex-start;
  @media (max-width: 1100px) {
    flex-direction: column;
  }

  .courses-main {
    flex: 2;
    min-width: 0;
    
    .courses-header-block {
      background: $orange;
      border-radius: $space-s;
      padding: $space-xl $space-xl $space-m $space-xl;
      margin-bottom: $space-xs;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-shadow: 0 4px 16px rgba($orange, 0.10);
      @media (max-width: 600px) {
        padding: $space-m $space-s $space-xs $space-s;
      }
      .page-title {
        color: $grey;
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        font-family: $font-family-primary-bold;
        margin-bottom: 0;
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
      display: flex;
      flex-direction: column;
      gap: $space-m;
      .course-card {
        display: flex;
        background: $white;
        border-radius: $space-s;
        box-shadow: 0 4px 16px rgba($black, 0.06);
        overflow: hidden;
        transition: box-shadow 0.2s, transform 0.2s;
        cursor: pointer;
        border: 1px solid rgba($black, 0.04);
        &:hover {
          box-shadow: 0 8px 32px rgba($black, 0.10);
          transform: translateY(-2px) scale(1.01);
          border-color: rgba($orange, 0.18);
        }
        .course-card-img {
          width: 110px;
          min-width: 110px;
          height: 110px;
          background: $white;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: $space-xs;
          }
        }
        .course-card-content {
          flex: 1;
          padding: $space-m $space-l $space-m $space-m;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .course-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            h3 {
              font-size: $font-size-l;
              font-weight: $font-weight-bold;
              margin: 0;
              color: $grey;
              font-family: $font-family-primary-bold;
            }
            .course-rating {
              display: flex;
              align-items: center;
              gap: $space-3xs;
              font-size: $font-size-m;
              color: $orange;
              i {
                font-size: $font-size-m;
              }
            }
          }
          .course-desc {
            color: $grey;
            opacity: 0.7;
            font-size: $font-size-s;
            margin: $space-3xs 0 $space-2xs 0;
            font-family: $font-family-primary-regular;
          }
          .course-tags {
            display: flex;
            gap: $space-2xs;
            margin-bottom: $space-2xs;
            .course-tag {
              background: $white;
              color: $grey;
              font-size: $font-size-xs;
              border-radius: $space-3xs;
              padding: 2px 10px;
              font-weight: $font-weight-semi-bold;
              border: 1px solid $orange;
            }
          }
          .course-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .course-date {
              color: $grey;
              opacity: 0.6;
              font-size: $font-size-xs;
            }
            .view-more {
              background: $orange;
              color: $white;
              border: none;
              border-radius: $space-xs;
              padding: $space-2xs $space-m;
              font-size: $font-size-s;
              font-weight: $font-weight-bold;
              cursor: pointer;
              transition: background 0.2s;
              font-family: $font-family-primary-medium;
              &:hover {
                background: $orange;
              }
            }
          }
        }
      }
    }
  }
  .courses-sidebar {
    flex: 1;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    gap: $space-l;
    @media (max-width: 1100px) {
      min-width: 0;
      width: 100%;
      flex-direction: row;
      gap: $space-m;
    }
    .calendar-box {
      background: $white;
      border-radius: $space-s;
      box-shadow: 0 2px 10px rgba($black, 0.05);
      padding: $space-l $space-m $space-m $space-m;
      .calendar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: $font-weight-bold;
        font-size: $font-size-m;
        margin-bottom: $space-2xs;
        .calendar-arrows {
          display: flex;
          gap: $space-3xs;
          i {
            font-size: $font-size-m;
            color: $grey;
            cursor: pointer;
            transition: color 0.2s;
            &:hover {
              color: $orange;
            }
          }
        }
      }
      .calendar-days {
        display: flex;
        justify-content: space-between;
        .calendar-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: $font-size-xs;
          color: $grey;
          .day-label {
            font-weight: $font-weight-semi-bold;
          }
          .day-num {
            font-size: $font-size-s;
            font-weight: $font-weight-bold;
            color: $grey;
          }
          &.today {
            .day-num {
              color: $orange;
            }
            .dot {
              width: 6px;
              height: 6px;
              background: $orange;
              border-radius: 50%;
              margin-top: 2px;
            }
          }
        }
      }
    }
  }
}
</style> 