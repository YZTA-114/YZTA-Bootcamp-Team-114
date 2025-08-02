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
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>

    <template #content>
      <div class="teacher-students">
        <!-- Header Section -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">Öğrencilerim</h1>
            <p class="page-subtitle">Tüm öğrencilerinizi yönetin ve takip edin</p>
            <div class="header-actions">
              <button class="btn btn-primary" @click="addNewStudent">
                <ri-add-line />
                Yeni Öğrenci Ekle
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-gradient-box" style="border: 2px solid rgba(230, 126, 34, 0.5);">
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-orange"><ri-group-line /></div>
              <div class="stat-title">Toplam Öğrenci</div>
            </div>
            <div class="stat-score"><span>{{ stats.totalStudents }}</span><span class="stat-outof">/200</span></div>
            <div class="stat-percent">85%</div>
            <div class="stat-desc">Sınıf kapasitesinin %85'i dolu</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-pink"><ri-user-line /></div>
              <div class="stat-title">Aktif Öğrenci</div>
            </div>
            <div class="stat-score"><span>{{ stats.activeStudents }}</span><span class="stat-outof">/170</span></div>
            <div class="stat-percent">92%</div>
            <div class="stat-desc">Öğrencilerin %92'si aktif</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-yellow"><ri-star-line /></div>
              <div class="stat-title">Ortalama Başarı</div>
            </div>
            <div class="stat-score"><span>{{ stats.averageGrade }}</span><span class="stat-outof">%</span></div>
            <div class="stat-percent">{{ stats.averageGrade }}%</div>
            <div class="stat-desc">Genel başarı ortalaması çok iyi</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-col">
            <div class="stat-header-row">
              <div class="stat-bigicon stat-green"><ri-time-line /></div>
              <div class="stat-title">Bu Hafta Katılım</div>
            </div>
            <div class="stat-score"><span>{{ stats.weeklyAttendance }}</span><span class="stat-outof">%</span></div>
            <div class="stat-percent">{{ stats.weeklyAttendance }}%</div>
            <div class="stat-desc">Haftalık katılım oranı yüksek</div>
          </div>
        </div>

        <!-- Search and Filter Section -->
        <div class="search-filter-section">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input v-model="searchQuery" placeholder="Öğrenci ara..." />
          </div>
          
          <!-- Class Dropdown -->
          <div class="filter-dropdown">
            <button 
              @click="toggleClassDropdown"
              class="filter-dropdown-btn"
              :class="{ active: showClassDropdown }"
            >
              <div class="filter-btn-content">
                <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span class="filter-text">{{ selectedClass || 'Tüm Dersler' }}</span>
              </div>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            <div v-show="showClassDropdown" class="filter-dropdown-menu">
              <div class="dropdown-header">
                <h4>Ders Seçin</h4>
                <button class="close-dropdown-btn" @click="toggleClassDropdown">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="dropdown-options">
                <button 
                  @click="selectClass('')"
                  class="dropdown-option"
                  :class="{ selected: selectedClass === '' }"
                >
                  <span>Tüm Dersler</span>
                  <svg v-if="selectedClass === ''" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
                <button 
                  v-for="classOption in classOptions" 
                  :key="classOption.value"
                  @click="selectClass(classOption.value)"
                  class="dropdown-option"
                  :class="{ selected: selectedClass === classOption.value }"
                >
                  <span>{{ classOption.label }}</span>
                  <svg v-if="selectedClass === classOption.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Status Dropdown -->
          <div class="filter-dropdown">
            <button 
              @click="toggleStatusDropdown"
              class="filter-dropdown-btn"
              :class="{ active: showStatusDropdown }"
            >
              <div class="filter-btn-content">
                <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
                </svg>
                <span class="filter-text">{{ selectedStatus || 'Tüm Durumlar' }}</span>
              </div>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            <div v-show="showStatusDropdown" class="filter-dropdown-menu">
              <div class="dropdown-header">
                <h4>Durum Seçin</h4>
                <button class="close-dropdown-btn" @click="toggleStatusDropdown">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="dropdown-options">
                <button 
                  @click="selectStatus('')"
                  class="dropdown-option"
                  :class="{ selected: selectedStatus === '' }"
                >
                  <span>Tüm Durumlar</span>
                  <svg v-if="selectedStatus === ''" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
                <button 
                  v-for="statusOption in statusOptions" 
                  :key="statusOption.value"
                  @click="selectStatus(statusOption.value)"
                  class="dropdown-option"
                  :class="{ selected: selectedStatus === statusOption.value }"
                >
                  <span>{{ statusOption.label }}</span>
                  <svg v-if="selectedStatus === statusOption.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button class="btn btn-outline export-btn" @click="exportStudents">
            <ri-download-line />
            Dışa Aktar
          </button>
        </div>

        <!-- Students Table -->
        <div class="students-table-container">
          <div class="table-header">
            <h2 class="table-title">Öğrenci Listesi</h2>
            <div class="table-actions">
              <span class="student-count">{{ filteredStudents.length }} öğrenci</span>
            </div>
          </div>
          
          <div class="students-table">
            <div class="table-row header-row">
              <div class="table-col">ÖĞRENCİ</div>
              <div class="table-col">SINIF</div>
              <div class="table-col">KATILIM</div>
              <div class="table-col">BAŞARI</div>
              <div class="table-col">DURUM</div>
              <div class="table-col">İŞLEMLER</div>
            </div>
            
            <div 
              v-for="student in paginatedStudents" 
              :key="student.id" 
              class="table-row student-row"
              @click="viewStudentDetails(student)"
            >
              <div class="table-col student-info">
                <div class="student-avatar">
                  <img :src="student.avatar" :alt="student.name" />
                </div>
                <div class="student-details">
                  <h4 class="student-name">{{ student.name }}</h4>
                  <p class="student-email">{{ student.email }}</p>
                </div>
              </div>
              
              <div class="table-col">
                <span class="class-badge">{{ student.class }}</span>
              </div>
              
              <div class="table-col">
                <div class="attendance-bar">
                  <div class="attendance-fill" :style="{ width: student.attendance + '%' }"></div>
                  <span class="attendance-text">{{ student.attendance }}%</span>
                </div>
              </div>
              
              <div class="table-col">
                <div class="grade-indicator" :class="getGradeClass(student.grade)">
                  {{ student.grade }}%
                </div>
              </div>
              
              <div class="table-col">
                <span class="status-badge" :class="getStatusClass(student.status)">
                  {{ getStatusText(student.status) }}
                </span>
              </div>
              
              <div class="table-col actions">
                <button class="action-btn" @click.stop="editStudent(student)" title="Düzenle">
                  <ri-edit-line />
                </button>
                <button class="action-btn" @click.stop="viewProgress(student)" title="İlerleme">
                  <ri-bar-chart-line />
                </button>
                <button class="action-btn" @click.stop="sendMessage(student)" title="Mesaj">
                  <ri-message-line />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="pagination">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <ri-arrow-left-line />
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <ri-arrow-right-line />
            </button>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

// Router
const router = useRouter()

// User data
const userName = ref('Dr. Sarah Johnson')
const userRole = ref('Teacher')
const userAvatar = ref('/default-avatar.png')
const currentPage = ref('Öğrenciler')
const notificationCount = ref(5)
const isSidebarCollapsed = ref(false)

// Stats
const stats = ref({
  totalStudents: 170,
  activeStudents: 156,
  averageGrade: 87,
  weeklyAttendance: 94
})

// Navigation items
const navItems = ref([
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/teacher/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'courses',
    label: 'Derslerim',
    path: '/teacher/courses',
    icon: 'ri-book-line'
  },
  {
    id: 'quizzes',
    label: 'Quizler',
    path: '/teacher/quizzes',
    icon: 'ri-task-line'
  },
  {
    id: 'students',
    label: 'Öğrenciler',
    path: '/teacher/students',
    icon: 'ri-group-line'
  },
  {
    id: 'grades',
    label: 'Notlar',
    path: '/teacher/grades',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'analytics',
    label: 'Analitik',
    path: '/teacher/analytics',
    icon: 'ri-analytics-line'
  },
  {
    id: 'profile',
    label: 'Profil',
    path: '/teacher/profile',
    icon: 'ri-user-line'
  }
])

// Students data
const students = ref([
  {
    id: 1,
    name: 'Muhammet Yılmaz',
    email: 'muhammet.yilmaz@email.com',
    avatar: '/default-avatar.png',
    class: 'Matematik',
    attendance: 95,
    grade: 92,
    status: 'active'
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse.demir@email.com',
    avatar: '/default-avatar.png',
    class: 'Fizik',
    attendance: 88,
    grade: 85,
    status: 'active'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@email.com',
    avatar: '/default-avatar.png',
    class: 'Kimya',
    attendance: 92,
    grade: 78,
    status: 'active'
  },
  {
    id: 4,
    name: 'Fatma Özkan',
    email: 'fatma.ozkan@email.com',
    avatar: '/default-avatar.png',
    class: 'Biyoloji',
    attendance: 76,
    grade: 81,
    status: 'inactive'
  },
  {
    id: 5,
    name: 'Ali Yıldız',
    email: 'ali.yildiz@email.com',
    avatar: '/default-avatar.png',
    class: 'Matematik',
    attendance: 100,
    grade: 96,
    status: 'active'
  },
  {
    id: 6,
    name: 'Zeynep Çelik',
    email: 'zeynep.celik@email.com',
    avatar: '/default-avatar.png',
    class: 'Fizik',
    attendance: 82,
    grade: 89,
    status: 'active'
  },
  {
    id: 7,
    name: 'Can Arslan',
    email: 'can.arslan@email.com',
    avatar: '/default-avatar.png',
    class: 'Kimya',
    attendance: 94,
    grade: 91,
    status: 'active'
  },
  {
    id: 8,
    name: 'Elif Şahin',
    email: 'elif.sahin@email.com',
    avatar: '/default-avatar.png',
    class: 'Biyoloji',
    attendance: 89,
    grade: 84,
    status: 'active'
  }
])

// Search and filter
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')

// Dropdown states
const showClassDropdown = ref(false)
const showStatusDropdown = ref(false)

// Class and Status options for dropdowns
const classOptions = ref([
  { label: 'Matematik', value: 'matematik' },
  { label: 'Fizik', value: 'fizik' },
  { label: 'Kimya', value: 'kimya' },
  { label: 'Tarih', value: 'tarih' },
  { label: 'Coğrafya', value: 'cografya' },
  { label: 'Biyoloji', value: 'biyoloji' }
])

const statusOptions = ref([
  { label: 'Aktif', value: 'active' },
  { label: 'Pasif', value: 'inactive' },
  { label: 'Mezun', value: 'graduated' }
])

// Pagination
const currentPageNum = ref(1)
const itemsPerPage = 6

// Computed properties
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesClass = !selectedClass.value || student.class.toLowerCase() === selectedClass.value.toLowerCase()
    const matchesStatus = !selectedStatus.value || student.status === selectedStatus.value
    
    return matchesSearch && matchesClass && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))

const paginatedStudents = computed(() => {
  const start = (currentPageNum.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStudents.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPageNum.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const handleLogout = () => {
  router.push('/auth/login')
}

const handleProfile = () => {
  router.push('/teacher/profile')
}

const handleSettings = () => {
  router.push('/teacher/settings')
}

const addNewStudent = () => {
  router.push('/teacher/students/add')
}

const exportStudents = () => {
  // Export functionality
  console.log('Exporting students...')
}

const viewStudentDetails = (student) => {
  router.push(`/teacher/students/${student.id}`)
}

const editStudent = (student) => {
  router.push(`/teacher/students/${student.id}/edit`)
}

const viewProgress = (student) => {
  router.push(`/teacher/students/${student.id}/progress`)
}

const sendMessage = (student) => {
  router.push(`/teacher/students/${student.id}/message`)
}

const changePage = (page) => {
  currentPageNum.value = page
}

const getGradeClass = (grade) => {
  if (grade >= 90) return 'excellent'
  if (grade >= 80) return 'good'
  if (grade >= 70) return 'average'
  return 'poor'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'status-active'
    case 'inactive': return 'status-inactive'
    case 'graduated': return 'status-graduated'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Aktif'
    case 'inactive': return 'Pasif'
    case 'graduated': return 'Mezun'
    default: return status
  }
}

// Dropdown methods
const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value
  if (showClassDropdown.value) {
    showStatusDropdown.value = false
  }
}

const selectClass = (value) => {
  selectedClass.value = value
  showClassDropdown.value = false
}

const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value
  if (showStatusDropdown.value) {
    showClassDropdown.value = false
  }
}

const selectStatus = (value) => {
  selectedStatus.value = value
  showStatusDropdown.value = false
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showClassDropdown.value = false
  showStatusDropdown.value = false
}

// Lifecycle
onMounted(() => {
  console.log('Teacher students page mounted')
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    const dropdowns = document.querySelectorAll('.filter-dropdown')
    let clickedInside = false
    
    dropdowns.forEach(dropdown => {
      if (dropdown.contains(event.target)) {
        clickedInside = true
      }
    })
    
    if (!clickedInside) {
      closeDropdowns()
    }
  })
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

// KOYU TEMA OVERRIDES
body, .teacher-students, .page-header, .stats-gradient-box, .students-table-container, .students-table, .table-row {
  background: #000 !important;
  color: #fff !important;
}

.page-title, .page-subtitle {
  color: #fff !important;
}

.stats-gradient-box {
  background: #111 !important;
  color: #fff !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3) !important;
}

.stat-title, .stat-score, .stat-desc, .stat-percent, .stat-outof {
  color: #fff !important;
}

.students-table-container {
  background: #111 !important;
  color: #fff !important;
}

.table-row {
  background: #111 !important;
  color: #fff !important;
  border-bottom: 1.5px solid #333 !important;
}

.table-row:hover {
  background: #181818 !important;
}

.btn, .btn-primary, .btn-outline {
  background: #e67e22 !important;
  color: #fff !important;
  border: none !important;
}

.btn:hover, .btn-primary:hover, .btn-outline:hover {
  background: #ca6f1e !important;
  color: #fff !important;
}

.teacher-students {
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;

  .page-header {
    background: #e67e22;
    color: #fff;
    padding: $space-xl;
    border-radius: 12px;
    margin-bottom: $space-l;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 24px rgba(230, 126, 34, 0.2);

    .header-content {
      .page-title {
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        margin: 0 0 $space-xs 0;
        color: #fff;
        font-family: serif;
      }

      .page-subtitle {
        font-size: $font-size-m;
        color: rgba(255, 255, 255, 0.9);
        margin: 0 0 $space-xs 0;
        font-family: serif;
      }

      .header-actions {
        margin-top: $space-s;
        
        .btn {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #fff;
          padding: $space-s $space-l;
          border-radius: 8px;
          font-weight: $font-weight-semi-bold;
          transition: all 0.2s ease;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
          
          i {
            margin-right: $space-xs;
          }
        }
      }
    }


  }

  .search-filter-section {
    display: flex;
    gap: $space-m;
    margin-bottom: $space-l;
    align-items: center;
    flex-wrap: wrap;

    .search-input-wrapper {
      position: relative;
      flex: 1;
      min-width: 300px;

      .search-icon {
        position: absolute;
        left: $space-s;
        top: 50%;
        transform: translateY(-50%);
        color: rgba($white, 0.6);
        font-size: $font-size-m;
        width: 20px;
        height: 20px;
      }

      input {
        width: 100%;
        padding: $space-s $space-s $space-s $space-xl;
        border: 1px solid rgba($white, 0.2);
        border-radius: 8px;
        background: rgba($white, 0.1);
        color: $white;
        font-size: $font-size-s;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
          border-color: $orange;
        }

        &::placeholder {
          color: rgba($white, 0.5);
        }
      }
    }

    .filter-dropdown {
      position: relative;
      min-width: 180px;

      .filter-dropdown-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 16px;
        background: #232323;
        border: 2px solid #e67e22;
        border-radius: 12px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);

        &:hover {
          background: #2a2a2a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        &.active {
          border-color: #ca6f1e;
          box-shadow: 0 4px 16px rgba(230, 126, 34, 0.2);
        }

        .filter-btn-content {
          display: flex;
          align-items: center;
          gap: 10px;

          .filter-icon {
            width: 18px;
            height: 18px;
            color: #e67e22;
            flex-shrink: 0;
          }

          .filter-text {
            font-weight: 600;
            color: #fff;
          }
        }

        .dropdown-arrow {
          width: 16px;
          height: 16px;
          color: #fff;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        &.active .dropdown-arrow {
          transform: rotate(180deg);
        }
      }

      .filter-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 8px;
        background: #232323;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        border: 1px solid #333;
        z-index: 1000;
        overflow: hidden;
        animation: dropdownSlide 0.3s ease;

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #2a2a2a;
          border-bottom: 1px solid #333;

          h4 {
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          }

          .close-dropdown-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            color: #fff;
            transition: all 0.2s;

            &:hover {
              background: #333;
              color: #fff;
            }

            svg {
              width: 16px;
              height: 16px;
            }
          }
        }

        .dropdown-options {
          max-height: 300px;
          overflow-y: auto;

          .dropdown-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 12px 20px;
            border: none;
            background: transparent;
            cursor: pointer;
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-align: left;

            &:hover {
              background: #2a2a2a;
            }

            &.selected {
              background: #e67e22;
              color: #fff;
              font-weight: 600;
            }

            span {
              color: inherit;
            }

            .check-icon {
              width: 16px;
              height: 16px;
              flex-shrink: 0;
              color: #fff;
            }
          }
        }
      }
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .export-btn {
      background: rgba($white, 0.1) !important;
      border: 1px solid rgba($white, 0.2) !important;
      color: $white !important;
      padding: $space-s $space-m;
      border-radius: 8px;
      font-size: $font-size-s;
      transition: all 0.2s;

      &:hover {
        background: rgba($white, 0.2) !important;
        border-color: rgba($white, 0.3) !important;
      }

      i {
        margin-right: $space-xs;
      }
    }
  }

  .students-table-container {
    background: rgba($white, 0.02);
    border-radius: 12px;
    padding: $space-l;
    border: 1px solid rgba($white, 0.1);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-l;

      .table-title {
        font-size: $font-size-l;
        font-weight: $font-weight-semi-bold;
        margin: 0;
        color: $white;
      }

      .table-actions {
        .student-count {
          font-size: $font-size-s;
          color: rgba($white, 0.7);
        }
      }
    }

    .students-table {
      .table-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
        gap: $space-m;
        padding: $space-m 0;
        align-items: center;
        border-bottom: 1px solid rgba($white, 0.1);
        transition: background-color 0.2s;

        &:hover {
          background: rgba($white, 0.05) !important;
        }

        &.header-row {
          font-weight: $font-weight-bold;
          color: rgba($white, 0.8);
          border-bottom: 2px solid rgba($white, 0.2);
          padding-bottom: $space-s;
        }

        &.student-row {
          cursor: pointer;
          padding: $space-s 0;
        }

        .table-col {
          display: flex;
          align-items: center;
          gap: $space-s;

          &.student-info {
            .student-avatar {
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

            .student-details {
              .student-name {
                font-size: $font-size-s;
                font-weight: $font-weight-semi-bold;
                margin: 0 0 2px 0;
                color: $white;
              }

              .student-email {
                font-size: $font-size-xs;
                color: rgba($white, 0.6);
                margin: 0;
              }
            }
          }

          .class-badge {
            background: rgba($orange, 0.2);
            color: $orange;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: $font-size-xs;
            font-weight: $font-weight-semi-bold;
          }

          .attendance-bar {
            position: relative;
            width: 100%;
            height: 20px;
            background: rgba($white, 0.1);
            border-radius: 10px;
            overflow: hidden;

            .attendance-fill {
              height: 100%;
              background: linear-gradient(90deg, $orange, darken($orange, 10%));
              border-radius: 10px;
              transition: width 0.3s ease;
            }

            .attendance-text {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: $font-size-xs;
              font-weight: $font-weight-semi-bold;
              color: $white;
            }
          }

          .grade-indicator {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: $font-size-xs;
            font-weight: $font-weight-semi-bold;
            text-align: center;

            &.excellent {
              background: rgba(#28a745, 0.2);
              color: #28a745;
            }

            &.good {
              background: rgba($orange, 0.2);
              color: $orange;
            }

            &.average {
              background: rgba($yellow, 0.2);
              color: $yellow;
            }

            &.poor {
              background: rgba($pink, 0.2);
              color: $pink;
            }
          }

          .status-badge {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: $font-size-xs;
            font-weight: $font-weight-semi-bold;
            text-align: center;

            &.status-active {
              background: rgba(#28a745, 0.2);
              color: #28a745;
            }

            &.status-inactive {
              background: rgba($pink, 0.2);
              color: $pink;
            }

            &.status-graduated {
              background: rgba($orange, 0.2);
              color: $orange;
            }
          }

          &.actions {
            display: flex;
            gap: $space-xs;
            justify-content: flex-end;

            .action-btn {
              width: 32px;
              height: 32px;
              border: none;
              border-radius: 6px;
              background: rgba($white, 0.1);
              color: rgba($white, 0.7);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;

              &:hover {
                background: rgba($orange, 0.2);
                color: $orange;
              }
            }
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $space-s;
      margin-top: $space-l;

      .pagination-btn {
        width: 40px;
        height: 40px;
        border: 1px solid rgba($white, 0.2);
        background: rgba($white, 0.1);
        color: $white;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background: rgba($orange, 0.2);
          border-color: $orange;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .page-numbers {
        display: flex;
        gap: $space-xs;

        .page-btn {
          width: 40px;
          height: 40px;
          border: 1px solid rgba($white, 0.2);
          background: rgba($white, 0.1);
          color: $white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;

          &:hover {
            background: rgba($orange, 0.2);
            border-color: $orange;
          }

          &.active {
            background: $orange;
            border-color: $orange;
            color: $white;
          }
        }
      }
    }
  }
}

// Stats gradient box styles (reused from TeacherDashboard)
.stats-gradient-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background: $white;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba($black, 0.10);
  padding: $space-m $space-l;
  margin-bottom: $space-l;
  min-height: 160px;
  overflow: hidden;
}

.stat-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 $space-m;
  min-width: 0;
  text-align: center;
}

.stat-header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  width: 100%;
  margin-bottom: $space-xs;
}

.stat-title {
  color: #222;
  font-size: $font-size-m;
  font-weight: 600;
  text-align: left;
  margin-bottom: 0;
}

.stat-bigicon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0;
}

.stat-orange,
.stat-pink,
.stat-yellow,
.stat-green {
  background: linear-gradient(135deg, $pink, darken($pink, 10%));
  color: #fff;
}

.stat-score {
  color: #222;
  font-size: $font-size-xl;
  font-weight: 700;
  margin-bottom: 2px;
  text-align: center;
}

.stat-outof {
  font-size: $font-size-s;
  font-weight: 400;
  opacity: 0.8;
  margin-left: 2px;
  color: #222;
}

.stat-percent {
  background: rgba(0,0,0,0.08);
  color: #222;
  font-size: $font-size-xs;
  font-weight: 600;
  border-radius: 12px;
  padding: 2px 12px;
  margin-bottom: 2px;
  margin-top: 2px;
  display: inline-block;
}

.stat-desc {
  color: #222;
  font-size: $font-size-xs;
  text-align: center;
  margin-top: 2px;
  font-weight: 400;
}

.stat-divider {
  width: 1px;
  background: #222;
  margin: 0 $space-xs;
  border-radius: 2px;
}
</style> 