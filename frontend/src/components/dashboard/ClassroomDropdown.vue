<!-- Shared classroom dropdown component -->
<template>
  <div class="sidebar-classroom-dropdown modern-dropdown">
    <div class="dropdown-selected" @click="dropdownOpen = !dropdownOpen">
      <span v-if="hasClassrooms && selectedClassroom" class="dropdown-selected-title">{{ selectedClassroom?.name }} <span class="item-code">({{ selectedClassroom?.code }})</span></span>
      <span v-else class="dropdown-selected-title no-classroom">Sınıf seçiniz</span>
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
          :class="{ selected: classroom.id === selectedClassroom?.id }"
          @click="selectClassroom(classroom)"
        >
          {{ classroom.name }} <span class="item-code">({{ classroom.code }})</span>
        </div>
        <div v-if="filteredClassrooms.length === 0" class="dropdown-empty">Sonuç bulunamadı</div>
      </div>
      <div class="dropdown-footer">
        <button class="join-class-btn" @click="user.role === 'teacher' ? createNewClass() : joinNewClass()">
          <ri-add-line />
          {{user.role === 'teacher' ? 'Yeni Sınıf Oluştur' : 'Yeni Sınıfa Katıl'}}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification';

const toast = useToast()

const store = useStore()
const router = useRouter()

// Classroom data from store
const user = computed(() => store.getters['auth/getUser'])
const classrooms = computed(() => store.getters['classroom/getClassrooms']);
const hasClassrooms = computed(() => classrooms.value && classrooms.value.length > 0)
const selectedClassroom = ref(null)
const currentClassroom = computed(() => store.getters['classroom/getCurrentClassroom'])

// UI state
const dropdownOpen = ref(false)
const classroomSearch = ref('')

// Computed
const filteredClassrooms = computed(() => {
  if (!classroomSearch.value) return classrooms.value
  return classrooms.value.filter(c => 
    c?.name?.toLowerCase().includes(classroomSearch.value.toLowerCase())
  )
})

// Methods
async function selectClassroom(classroom) {
  selectedClassroom.value = classroom;
  dropdownOpen.value = false;
  await store.dispatch('classroom/setCurrentClassroom', classroom).then(() => {
    toast.success(`${classroom.name} sınıfına geçiş yapıldı`);
  }).catch((err) => {
    console.log(err);
    toast.error(err.message);
  });
}

function joinNewClass() {
  dropdownOpen.value = false
  router.push({name: 'JoinClassroom'})
}

function createNewClass() {
  dropdownOpen.value = false
  router.push('/teacher/create-classroom')
}

// Initialize selected classroom
if (hasClassrooms.value && !selectedClassroom.value) {
  selectedClassroom.value = classrooms.value[0]
}

onMounted(() => {
  if (currentClassroom.value) {
    selectedClassroom.value = currentClassroom.value;
  }
})
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
      border: 1.5px solid #888;
      box-shadow: 0 1px 4px rgba(136, 136, 136, 0.1);
      transition: border 0.2s;
    }
    
    .dropdown-selected:hover, .dropdown-selected:focus {
      border: 1.5px solid darken($orange, 10%);
    }
    .item-code {
        font-size: 0.8rem;
        color: #888;
        font-weight: 400;
      }
    .dropdown-selected-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      &.no-classroom {
        color: #888;
        font-style: italic;
      }

     
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
      border: 1.5px solid #888;
      animation: fadeIn 0.18s;
    }
    
    .dropdown-header {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      padding: 14px 18px 6px 18px;
      border-bottom: 1px solid rgba(136, 136, 136, 0.1);
      background: #232323;
    }
    
    .dropdown-search-wrapper {
      padding: 8px 18px 0 18px;
    }
    
    .dropdown-search {
      width: 100%;
      padding: 7px 12px;
      border-radius: 7px;
      border: 1.2px solid rgba(136, 136, 136, 0.3);
      background: #232323;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
      
      &:focus {
        border: 1.2px solid rgba(136, 136, 136, 0.5);
      }
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
      
      &.selected, &:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
    }
    
    .dropdown-footer {
      padding: 8px 18px 12px 18px;
      border-top: 1px solid rgba(136, 136, 136, 0.1);
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
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 