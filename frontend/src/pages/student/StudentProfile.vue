<template>
  <DashboardLayout
    :user-name="profile.fullName"
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
      <div class="profile-root-bg">
        <!-- Turuncu bilgi bloğu -->
        <div class="profile-info-banner">
          <div class="profile-info-banner-title">Öğrenci Profili</div>
          <div class="profile-info-banner-desc">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</div>
        </div>
        <!-- Profil headerı -->
        <div class="profile-header-card-centered">
          <div class="profile-avatar-edit-wrapper">
            <div class="avatar-circle-wrapper">
              <template v-if="profile.avatar">
                <img :src="profile.avatar" class="profile-avatar-pink" />
              </template>
              <template v-else>
                <div class="avatar-initials">{{ profile.fullName ? profile.fullName.charAt(0).toUpperCase() : '?' }}</div>
              </template>
              <button class="avatar-fab-btn" @click.prevent="triggerAvatarInput" title="Fotoğrafı değiştir">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/>
                  <circle cx="12" cy="13" r="3.5" stroke="#222" stroke-width="1.5"/>
                </svg>
              </button>
              <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
            </div>
          </div>
          <div class="profile-header-centered-name">{{ profile.fullName }} <span v-if="profile.verified" class="verified-badge">✔️</span></div>
          <div class="profile-header-centered-email">{{ profile.email }}</div>
        </div>
        <!-- Form kutusu -->
        <div class="profile-form-card orange-bordered-block">
          <form class="profile-form-grid" @submit.prevent="saveProfile">
            <div class="form-group">
              <label>Ad</label>
              <input type="text" v-model="profile.firstName" :disabled="!isEditing" />
            </div>
            <div class="form-group">
              <label>Soyad</label>
              <input type="text" v-model="profile.lastName" :disabled="!isEditing" />
            </div>
            <div class="form-group">
              <label>E-posta</label>
              <input type="email" v-model="profile.email" :disabled="!isEditing" />
            </div>
            <div class="form-group">
              <label>Telefon</label>
              <input type="text" v-model="profile.phone" :disabled="!isEditing" />
            </div>
            <div class="form-group">
              <label>Şehir/İl</label>
              <input type="text" v-model="profile.city" :disabled="!isEditing" />
            </div>
            <div class="form-group">
              <label>Ülke</label>
              <input type="text" v-model="profile.country" :disabled="!isEditing" />
            </div>
            <div class="form-group form-group-bio" style="grid-column: 1 / -1;">
              <label>Biyografi</label>
              <textarea v-model="profile.bio" rows="3" :disabled="!isEditing"></textarea>
            </div>
            <div class="form-actions" style="grid-column: 1 / -1;">
              <button v-if="!isEditing" type="button" class="btn-edit" @click="startEditing">Düzenle</button>
              <template v-else>
                <button type="button" class="btn-cancel" @click="cancelEditing">Vazgeç</button>
                <button type="submit" class="btn-save">Kaydet</button>
              </template>
            </div>
          </form>
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
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        firstName: 'Muhammet',
        lastName: '',
        city: '',
        country: '',
        bio: '',
        verified: false
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
    },
    triggerAvatarInput() {
      this.$refs.avatarInput.click();
    },
    onAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.profile.avatar = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    deleteAvatar() {
      this.profile.avatar = null;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.profile-root-bg {
  min-height: 100vh;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-s 0 $space-l 0;
  width: 100%;
  max-width: none;
  margin: 0;
}
.profile-info-banner {
  background: $orange;
  color: $white;
  border-radius: 16px;
  text-align: center;
  padding: $space-l 2vw $space-m 2vw;
  margin-bottom: $space-l;
  width: 100%;
  max-width: none;
  margin-left: 0;
  margin-right: 0;
  box-shadow: 0 2px 12px rgba($black,0.06);
}
.profile-info-banner-title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  letter-spacing: 0.01em;
  margin-bottom: 4px;
}
.profile-info-banner-desc {
  font-size: $font-size-xs;
  font-weight: $font-weight-regular;
  opacity: 0.97;
}
.profile-header-card-centered {
  background: $white;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba($black,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: none;
  padding: $space-xl 0 $space-l 0;
  margin-bottom: $space-l;
}
.profile-header-centered-name {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $grey;
  margin-top: $space-m;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.profile-header-centered-email {
  color: $grey;
  font-size: $font-size-xs;
  margin-bottom: 0;
}
.profile-form-card.orange-bordered-block {
  border: 2.5px solid $orange;
  border-radius: 18px;
  background: $white;
  padding: $space-l $space-m $space-m $space-m !important;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  margin-bottom: $space-l;
}
.profile-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-m $space-l;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.form-group label {
  font-weight: $font-weight-bold;
  color: $grey;
  font-size: $font-size-xs;
}
.form-group input,
.form-group textarea {
  border: 1.2px solid #e0e0e0;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: $font-size-xs;
  background: #fafbfc;
  transition: border 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: $orange;
  background: $white;
}
.form-group-bio textarea {
  min-height: 60px;
  resize: vertical;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: $space-m;
  margin-top: 8px;
}
.btn-cancel {
  background: #f3f3f3;
  color: #555;
  border: none;
  border-radius: 8px;
  padding: $space-s $space-xl;
  font-weight: $font-weight-semi-bold;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: #e0e0e0;
}
.btn-save {
  background: $orange;
  color: $white;
  border: none;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  padding: $space-s $space-xl;
  font-size: $font-size-xs;
}
.btn-save:hover {
  background: darken($orange, 10%);
}
.btn-edit {
  background: $orange;
  color: $white;
  border: none;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  padding: $space-s $space-xl;
  font-size: $font-size-xs;
}
.btn-edit:hover {
  background: darken($orange, 10%);
}
.profile-avatar-pink {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid $pink;
  background: $white;
}
.profile-avatar-edit-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  margin-bottom: 18px;
}
.avatar-edit-btn {
  background: #fff;
  border: 2px solid #e91e63;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  box-shadow: 0 2px 8px rgba(233,30,99,0.08);
  position: relative;
}
.avatar-edit-btn:hover {
  background: #ffe3f0;
  border-color: #ad1457;
}
.avatar-edit-btn svg {
  width: 22px;
  height: 22px;
  color: #e91e63;
}
.avatar-btn-group {
  display: flex;
  gap: 12px;
  position: absolute;
  right: 0;
  bottom: -38px;
}
.avatar-btn-change {
  background: #6c47ff;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(108,71,255,0.08);
}
.avatar-btn-change:hover {
  background: #4b2bb5;
}
.avatar-btn-delete {
  background: #fff0f0;
  color: #e53935;
  border: 1.5px solid #ffcdd2;
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.avatar-btn-delete:hover {
  background: #ffcdd2;
  border-color: #e53935;
}
.avatar-circle-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-avatar-pink {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid $pink;
  background: $white;
}
.avatar-initials {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: $grey;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  border: 4px solid $pink;
  user-select: none;
}
.avatar-fab-btn {
  position: absolute;
  right: -8px;
  bottom: -8px;
  background: $white;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba($pink, 0.10);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  padding: 0;
}
.avatar-fab-btn:hover {
  background: lighten($pink, 40%);
  box-shadow: 0 4px 16px rgba($pink, 0.18);
}
.avatar-fab-btn svg {
  width: 22px;
  height: 22px;
  display: block;
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
    .dropdown-empty {
      padding: 16px 18px;
      color: #bbb;
      text-align: center;
      font-size: 1rem;
    }
    .dropdown-footer {
      padding: 10px 18px 0 18px;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 8px;
      text-align: right;
    }
    .join-class-btn {
      background: $orange;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 22px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .join-class-btn:hover {
      background: darken($orange, 10%);
    }
  }
}
@media (max-width: 1200px) {
  .profile-root-bg,
  .profile-info-banner,
  .profile-header-card-centered,
  .profile-form-card.orange-bordered-block {
    max-width: 100vw;
    width: 100%;
    padding-left: 2vw;
    padding-right: 2vw;
  }
  .profile-info-banner {
    max-width: 100vw;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
@media (max-width: 900px) {
  .profile-info-banner,
  .profile-header-card-centered,
  .profile-form-card.orange-bordered-block {
    max-width: 99vw;
    padding: 10px 2vw 10px 2vw !important;
    margin-bottom: 18px;
  }
  .profile-header-card-centered {
    padding: 18px 0 18px 0;
  }
  .profile-header-centered-name {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  .profile-avatar-pink {
    width: 70px;
    height: 70px;
  }
  .profile-form-grid {
    grid-template-columns: 1fr;
    gap: 12px 0;
  }
}
</style> 