<template>
  <DashboardLayout
    user-name="Muhammet"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
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
    
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="isSidebarCollapsed" />
    </template>
    
    <template #content>
      <div class="student-profile">
        <!-- Welcome Section with Orange Background -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">Öğrenci Profili</h1>
            <p class="welcome-subtitle">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>

        </div>

        <div class="container">
          
          <div class="profile-container">
            <div class="profile-card">
              <div class="profile-avatar">
                <img 
                  :src="profile.avatar || '/src/assets/images/default-avatar.png'" 
                  :alt="profile.fullName"
                  class="avatar-img"
                />
                <button class="change-avatar-btn">
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              <div class="profile-info">
                <h3>{{ profile.fullName }}</h3>
                <p class="student-id">Öğrenci No: {{ profile.studentId }}</p>
                <p class="email">{{ profile.email }}</p>
              </div>
            </div>
            
            <div class="profile-details">
              <div class="detail-section">
                <h4>Kişisel Bilgiler</h4>
                <div class="form-group">
                  <label>Ad Soyad</label>
                  <input 
                    type="text" 
                    v-model="profile.fullName" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
                <div class="form-group">
                  <label>E-posta</label>
                  <input 
                    type="email" 
                    v-model="profile.email" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
                <div class="form-group">
                  <label>Telefon</label>
                  <input 
                    type="tel" 
                    v-model="profile.phone" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
                <div class="form-group">
                  <label>Doğum Tarihi</label>
                  <input 
                    type="date" 
                    v-model="profile.birthDate" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Eğitim Bilgileri</h4>
                <div class="form-group">
                  <label>Sınıf</label>
                  <input 
                    type="text" 
                    v-model="profile.grade" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
                <div class="form-group">
                  <label>Bölüm</label>
                  <input 
                    type="text" 
                    v-model="profile.department" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
                <div class="form-group">
                  <label>Öğrenci Numarası</label>
                  <input 
                    type="text" 
                    v-model="profile.studentId" 
                    class="form-control"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
              
              <div class="profile-actions">
                <button 
                  v-if="!isEditing" 
                  @click="startEditing" 
                  class="btn btn-primary"
                >
                  <i class="fas fa-edit"></i> Düzenle
                </button>
                <div v-else class="action-buttons">
                  <button @click="saveProfile" class="btn btn-success">
                    <i class="fas fa-save"></i> Kaydet
                  </button>
                  <button @click="cancelEditing" class="btn btn-secondary">
                    <i class="fas fa-times"></i> İptal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

export default {
  name: 'StudentProfile',
  components: {
    DashboardLayout,
    DashboardNav
  },
  data() {
    return {
      isEditing: false,
      originalProfile: {},
      profile: {
        fullName: 'Muhammet',
        email: 'muhammet@example.com',
        phone: '+90 555 123 4567',
        birthDate: '2000-01-01',
        studentId: '2024001',
        grade: '4. Sınıf',
        department: 'Bilgisayar Mühendisliği',
        avatar: null
      },
      // Dashboard layout props
      userRole: 'Student',
      userAvatar: '/src/assets/images/default-avatar.png',
      currentPage: 'Profil',
      notificationCount: 3,
      isSidebarCollapsed: false,
      
      // Classroom dropdown
      dropdownOpen: false,
      classroomSearch: '',
      selectedClassroom: {
        id: 1,
        name: 'Matematik Sınıfı'
      },
      classrooms: [
        { id: 1, name: 'Matematik Sınıfı' },
        { id: 2, name: 'Fizik Sınıfı' },
        { id: 3, name: 'Kimya Sınıfı' },
        { id: 4, name: 'Biyoloji Sınıfı' },
        { id: 5, name: 'Tarih Sınıfı' }
      ],
      
      // Navigation items
      navItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/student/dashboard',
          icon: 'ri-dashboard-line'
        },
        {
          id: 'courses',
          label: 'Dersler',
          path: '/student/courses',
          icon: 'ri-book-line'
        },
        {
          id: 'assignments',
          label: 'Quizler',
          path: '/student/assignments',
          icon: 'ri-task-line'
        },
        {
          id: 'documents',
          label: 'Dokümanlarım',
          path: '/student/documents',
          icon: 'ri-file-text-line'
        },
        {
          id: 'calendar',
          label: 'Takvim',
          path: '/student/calendar',
          icon: 'ri-calendar-line'
        },
        {
          id: 'profile',
          label: 'Profil',
          path: '/student/profile',
          icon: 'ri-user-line'
        }
      ]
    }
  },
  computed: {
    filteredClassrooms() {
      if (!this.classroomSearch) return this.classrooms
      return this.classrooms.filter(classroom => 
        classroom.name.toLowerCase().includes(this.classroomSearch.toLowerCase())
      )
    }
  },
  mounted() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        console.log('Profil bilgileri yükleniyor...')
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('Profil bilgileri yüklenirken hata oluştu:', error)
      }
    },
    startEditing() {
      this.originalProfile = { ...this.profile }
      this.isEditing = true
    },
    cancelEditing() {
      this.profile = { ...this.originalProfile }
      this.isEditing = false
    },
    async saveProfile() {
      try {
        console.log('Profil kaydediliyor:', this.profile)
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.isEditing = false
      } catch (error) {
        console.error('Profil güncellenirken hata oluştu:', error)
      }
    },
    
    // Dashboard layout methods
    handleLogout() {
      console.log('Çıkış yapılıyor...')
      this.$router.push('/auth/login')
    },
    handleProfile() {
      console.log('Profil sayfasına gidiliyor...')
      this.$router.push('/student/profile')
    },
    handleSettings() {
      console.log('Ayarlar sayfasına gidiliyor...')
    },
    
    // Classroom dropdown methods
    selectClassroom(classroom) {
      this.selectedClassroom = classroom
      this.dropdownOpen = false
    },
    joinNewClass() {
      console.log('Yeni sınıfa katılma...')
      this.dropdownOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.student-profile {
  padding: 2rem 0;
  
  // Welcome Section with Orange Background
  .welcome-section {
    background: $orange;
    color: $white;
    padding: $space-m;
    border-radius: 8px;
    margin-bottom: $space-m;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .welcome-content {
      .welcome-title {
        font-size: $font-size-l;
        font-weight: $font-weight-bold;
        font-family: $font-family-primary-medium;
        margin: 0 0 $space-xs 0;
      }

      .welcome-subtitle {
        font-size: $font-size-s;
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
        padding: $space-xs $space-m;
        border-radius: 6px;
        font-weight: $font-weight-semi-bold;
        font-family: $font-family-primary-medium;
        transition: all 0.2s ease;
        cursor: pointer;
        font-size: $font-size-xs;

        &:hover {
          background-color: rgba($white, 0.3);
          transform: translateY(-2px);
        }

        i {
          margin-right: $space-xs;
        }
      }

      .action-buttons {
        display: flex;
        gap: $space-xs;
      }
    }
  }
  
  .profile-header {
    text-align: center;
    margin-bottom: 3rem;
    
    h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }
  }
  
  .profile-container {
    display: flex;
    gap: $space-l;
    margin-top: $space-m;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .profile-card {
    background: white;
    border-radius: 12px;
    padding: $space-l;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex-shrink: 0;
    width: 300px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
    
    .profile-avatar {
      position: relative;
      display: inline-block;
      margin-bottom: 1.5rem;
      
      .avatar-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #e9ecef;
      }
      
      .change-avatar-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
        
        &:hover {
          background: #0056b3;
        }
      }
    }
    
    .profile-info {
      h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }
      
      .student-id {
        color: #007bff;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .email {
        color: #6c757d;
        margin-bottom: 0;
      }
    }
  }
  
  .profile-details {
    background: white;
    border-radius: 12px;
    padding: $space-l;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex: 1;
    
    .detail-section {
      margin-bottom: 2rem;
      
      h4 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e9ecef;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #495057;
          font-weight: 600;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
          
          &:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
          
          &:disabled {
            background-color: #f8f9fa;
            color: #6c757d;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .profile-actions {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
      
      .btn {
        padding: 0.75rem 2rem;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s;
        border: none;
        cursor: pointer;
        
        &.btn-primary {
          background: #007bff;
          color: white;
          
          &:hover {
            background: #0056b3;
          }
        }
        
        &.btn-success {
          background: #28a745;
          color: white;
          
          &:hover {
            background: #1e7e34;
          }
        }
        
        &.btn-secondary {
          background: #6c757d;
          color: white;
          
          &:hover {
            background: #545b62;
          }
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
    }
  }
}

// Classroom dropdown styles
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

@media (max-width: 768px) {
  .student-profile {
    .profile-actions {
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style> 