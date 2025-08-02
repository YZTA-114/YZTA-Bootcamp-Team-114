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
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Öğrencilerim</h1>
            <p class="welcome-subtitle">Tüm öğrencilerinizi yönetin ve takip edin</p>
          </div>
          <div class="welcome-actions">
            <button class="btn btn-primary" @click="addNewStudent">
              <ri-add-line />
              Yeni Öğrenci Ekle
            </button>
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
                <button class="action-btn" @click.stop="editStudent(student)" title="Öğrenci Bilgilerini Düzenle">
                  <ri-edit-line class="action-icon" />
                </button>
                <button class="action-btn" @click.stop="viewProgress(student)" title="Öğrenci İlerlemesini Görüntüle">
                  <ri-bar-chart-line class="action-icon" />
                </button>
                <button class="action-btn" @click.stop="sendMessage(student)" title="Öğrenciye Mesaj Gönder">
                  <ri-message-line class="action-icon" />
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

  <!-- Add Student Modal -->
  <div v-if="showAddStudentModal" class="modal-overlay" @click="closeAddStudentModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Yeni Öğrenci Ekle</h2>
        <button class="modal-close-btn" @click="closeAddStudentModal">
          <ri-close-line />
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="submitNewStudent">
          <div class="form-row">
            <div class="form-group">
              <label for="studentName">Öğrenci Adı *</label>
              <input 
                type="text" 
                id="studentName" 
                v-model="newStudent.name" 
                placeholder="Öğrenci adını girin"
                required
              />
            </div>
            <div class="form-group">
              <label for="studentEmail">E-posta *</label>
              <input 
                type="email" 
                id="studentEmail" 
                v-model="newStudent.email" 
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Sınıf *</label>
              <div class="custom-dropdown">
                <button 
                  type="button"
                  @click="toggleModalClassDropdown"
                  class="custom-dropdown-btn"
                  :class="{ active: showModalClassDropdown }"
                >
                  <div class="dropdown-btn-content">
                    <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
                    </svg>
                    <span class="dropdown-text">{{ newStudent.class || 'Sınıf seçin' }}</span>
                  </div>
                  <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                
                <div v-show="showModalClassDropdown" class="custom-dropdown-menu">
                  <div class="dropdown-header">
                    <h4>Sınıf Seçin</h4>
                    <button type="button" class="close-dropdown-btn" @click="toggleModalClassDropdown">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <div class="dropdown-options">
                    <button 
                      type="button"
                      @click="selectModalClass('9A')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '9A' }"
                    >
                      <span>9A</span>
                      <svg v-if="newStudent.class === '9A'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('9B')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '9B' }"
                    >
                      <span>9B</span>
                      <svg v-if="newStudent.class === '9B'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('10A')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '10A' }"
                    >
                      <span>10A</span>
                      <svg v-if="newStudent.class === '10A'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('10B')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '10B' }"
                    >
                      <span>10B</span>
                      <svg v-if="newStudent.class === '10B'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('11A')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '11A' }"
                    >
                      <span>11A</span>
                      <svg v-if="newStudent.class === '11A'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('11B')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '11B' }"
                    >
                      <span>11B</span>
                      <svg v-if="newStudent.class === '11B'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('12A')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '12A' }"
                    >
                      <span>12A</span>
                      <svg v-if="newStudent.class === '12A'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      @click="selectModalClass('12B')"
                      class="dropdown-option"
                      :class="{ selected: newStudent.class === '12B' }"
                    >
                      <span>12B</span>
                      <svg v-if="newStudent.class === '12B'" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="studentPhone">Telefon</label>
              <input 
                type="tel" 
                id="studentPhone" 
                v-model="newStudent.phone" 
                placeholder="0555 123 45 67"
              />
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddStudentModal">
              İptal
            </button>
            <button type="submit" class="btn btn-primary">
              <ri-add-line />
              Öğrenci Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
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

// Stats (commented out as not currently used)
// const stats = ref({
//   totalStudents: 170,
//   activeStudents: 156,
//   averageGrade: 87,
//   weeklyAttendance: 94
// })

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

// Modal state
const showAddStudentModal = ref(false)
const showModalClassDropdown = ref(false)

// New student form data
const newStudent = ref({
  name: '',
  email: '',
  class: '',
  phone: ''
})

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
  showAddStudentModal.value = true
}

const closeAddStudentModal = () => {
  showAddStudentModal.value = false
  showModalClassDropdown.value = false
  // Reset form
  newStudent.value = {
    name: '',
    email: '',
    class: '',
    phone: ''
  }
}

const toggleModalClassDropdown = () => {
  showModalClassDropdown.value = !showModalClassDropdown.value
}

const selectModalClass = (className) => {
  newStudent.value.class = className
  showModalClassDropdown.value = false
}

const submitNewStudent = () => {
  // Generate a new ID
  const newId = Math.max(...students.value.map(s => s.id)) + 1
  
  // Create new student object
  const studentToAdd = {
    id: newId,
    name: newStudent.value.name,
    email: newStudent.value.email,
    avatar: '/default-avatar.png',
    class: newStudent.value.class,
    attendance: 0,
    grade: 0,
    status: 'active',
    phone: newStudent.value.phone
  }
  
  // Add to students array
  students.value.push(studentToAdd)
  
  // Close modal
  closeAddStudentModal()
  
  // Show success message (you can implement a toast notification here)
  console.log('Yeni öğrenci başarıyla eklendi:', studentToAdd)
}

// Export functionality (commented out as not currently used)
// const exportStudents = () => {
//   console.log('Exporting students...')
// }

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

.btn:not(.title-btn), .btn-primary:not(.title-btn), .btn-outline:not(.title-btn) {
  background: #e67e22 !important;
  color: #fff !important;
  border: none !important;
}

.btn:not(.title-btn):hover, .btn-primary:not(.title-btn):hover, .btn-outline:not(.title-btn):hover {
  background: #ca6f1e !important;
  color: #fff !important;
}

.teacher-students {
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;

  .welcome-section {
    background: #e67e22;
    color: #fff;
    padding: $space-xl;
    border-radius: 12px;
    margin-bottom: $space-l;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 24px rgba(230, 126, 34, 0.2);

    .welcome-content {
      .welcome-title {
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        margin: 0 0 $space-xs 0;
        color: #fff;
        font-family: serif;
      }

      .welcome-subtitle {
        font-size: $font-size-m;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-family: serif;
      }
    }

    .welcome-actions {
      .btn {
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #fff;
        padding: $space-s $space-l;
        border-radius: 8px;
        font-weight: $font-weight-semi-bold;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: $space-xs;
        backdrop-filter: blur(10px);
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
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
              width: 28px;
              height: 28px;
              border: none;
              border-radius: 6px;
              background: rgba($white, 0.1);
              color: rgba($white, 0.7);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
              position: relative;

              .action-icon {
                font-size: 14px;
                width: 14px;
                height: 14px;
              }

              &:hover {
                background: rgba($orange, 0.2);
                color: $orange;
                transform: scale(1.1);
              }

              &:hover::after {
                content: attr(title);
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
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

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: #000000;
  border-radius: 12px;
  width: 85%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: #e67e22;
  color: white;
  padding: $space-m;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    margin: 0;
    font-family: serif;
  }

  .modal-close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: $space-xs;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  }
}

.modal-body {
  padding: $space-l;
  color: white;

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-m;
    margin-bottom: $space-m;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: $space-m;
    }
  }

  .form-group {
    margin-bottom: $space-m;

    label {
      display: block;
      margin-bottom: $space-xs;
      font-weight: $font-weight-semi-bold;
      color: rgba(255, 255, 255, 0.9);
      font-size: $font-size-xs;
    }

    input, select, textarea {
      width: 100%;
      padding: $space-s;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: $font-size-xs;
      transition: all 0.2s;
      box-sizing: border-box;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
        border-color: #e67e22;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2);
      }
    }

    select {
      cursor: pointer;

      option {
        background: #2c3e50;
        color: white;
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    .custom-dropdown {
      position: relative;
      width: 100%;

      .custom-dropdown-btn {
        width: 100%;
        padding: $space-s;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: $font-size-xs;
        transition: all 0.2s;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;

        &:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        &.active {
          border-color: #e67e22;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2);
        }

        .dropdown-btn-content {
          display: flex;
          align-items: center;
          gap: $space-s;

          .dropdown-icon {
            width: 16px;
            height: 16px;
            color: rgba(255, 255, 255, 0.7);
          }

          .dropdown-text {
            color: white;
          }
        }

        .dropdown-arrow {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.7);
          transition: transform 0.2s;
        }

        &.active .dropdown-arrow {
          transform: rotate(180deg);
        }
      }

      .custom-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        margin-top: 4px;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        max-height: 200px;
        overflow-y: auto;

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: $space-m;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);

          h4 {
            margin: 0;
            font-size: $font-size-s;
            font-weight: $font-weight-semi-bold;
            color: white;
          }

          .close-dropdown-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;

            svg {
              width: 16px;
              height: 16px;
            }

            &:hover {
              background: rgba(255, 255, 255, 0.1);
              color: white;
            }
          }
        }

        .dropdown-options {
          padding: $space-xs;

          .dropdown-option {
            width: 100%;
            padding: $space-s $space-m;
            background: transparent;
            border: none;
            color: white;
            text-align: left;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: $font-size-s;

            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }

            &.selected {
              background: rgba(230, 126, 34, 0.2);
              color: #e67e22;
            }

            .check-icon {
              width: 16px;
              height: 16px;
              color: #e67e22;
            }
          }
        }
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: $space-s;
    justify-content: flex-end;
    margin-top: $space-l;
    padding-top: $space-m;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .btn {
      padding: $space-s $space-m;
      border-radius: 6px;
      font-weight: $font-weight-semi-bold;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: $space-xs;
      border: none;
      font-size: $font-size-xs;

      &.btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      }

      &.btn-primary {
        background: #e67e22;
        color: white;
        border: 1px solid #e67e22;

        &:hover {
          background: #d35400;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>