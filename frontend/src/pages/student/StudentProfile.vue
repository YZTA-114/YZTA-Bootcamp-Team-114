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
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="profile-header">
                <h1>Öğrenci Profili</h1>
                <p>Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-lg-4 col-md-6 mb-4">
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
            </div>
            
            <div class="col-lg-8 col-md-6">
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
        { id: 3, name: 'Kimya Sınıfı' }
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
          label: 'Derslerim',
          path: '/student/courses',
          icon: 'ri-book-line'
        },
        {
          id: 'documents',
          label: 'Dokümanlar',
          path: '/student/documents',
          icon: 'ri-file-text-line'
        },
        {
          id: 'quizzes',
          label: 'Quizler',
          path: '/student/quizzes',
          icon: 'ri-question-line'
        },
        {
          id: 'profile',
          label: 'Profil',
          path: '/student/profile',
          icon: 'ri-user-line',
          badge: 'Aktif'
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
.student-profile {
  padding: 2rem 0;
  
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
  
  .profile-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    
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
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
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
  margin: 0 16px 16px 16px;
  
  .dropdown-selected {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .dropdown-selected-title {
      color: #fff;
      font-weight: 500;
    }
    
    .dropdown-arrow {
      color: #fff;
      transition: transform 0.2s ease;
      
      &.open {
        transform: rotate(180deg);
      }
    }
  }
  
  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #232323;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    margin-top: 4px;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    
    .dropdown-header {
      padding: 12px 16px;
      color: #fff;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dropdown-search-wrapper {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .dropdown-search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
    
    .dropdown-items {
      .dropdown-item {
        padding: 12px 16px;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        &.selected {
          background: rgba(139, 231, 139, 0.2);
          color: #8be78b;
        }
      }
      
      .dropdown-empty {
        padding: 12px 16px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }
    }
    
    .dropdown-footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      
      .join-class-btn {
        width: 100%;
        padding: 8px 12px;
        background: #8be78b;
        color: #232323;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background-color 0.2s ease;
        
        &:hover {
          background: #7dd67d;
        }
      }
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