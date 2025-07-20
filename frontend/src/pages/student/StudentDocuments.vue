<template>
  <DashboardLayout
    :user-name="userName"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :current-page="'Dokümanlar'"
    :notification-count="notificationCount"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="false" />
    </template>
    <template #content>
      <div class="student-documents">
        <h1>Dokümanlar</h1>
        <div class="documents-search-bar">
          <input v-model="search" placeholder="Döküman ara..." />
          <select v-model="selectedCourse">
            <option value="">Tüm Dersler</option>
            <option v-for="c in courses" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="documents-list">
          <div v-for="doc in filteredDocuments" :key="doc.id" class="document-item">
            <h3>{{ doc.title }}</h3>
            <p>{{ doc.description }}</p>
            <span>Ders: {{ doc.course }}</span>
            <span>Öğretmen: {{ doc.teacher }}</span>
            <span>Tarih: {{ doc.date }}</span>
            <a :href="doc.url" target="_blank">İndir</a>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'
import DashboardNav from '@/components/dashboard/DashboardNav.vue'

const userName = ref('John Doe')
const userRole = ref('Student')
const userAvatar = ref('/default.png')
const notificationCount = ref(0)

const navItems = ref([
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
    id: 'grades',
    label: 'Dokümanlar',
    path: '/student/documents',
    icon: 'ri-bar-chart-line'
  },
  {
    id: 'calendar',
    label: 'Takvim',
    path: '/student/calendar',
    icon: 'ri-calendar-line'
  },
  {
    id: 'resources',
    label: 'Kaynaklarım',
    path: '/student/resources',
    icon: 'ri-folder-line'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/student/profile',
    icon: 'ri-user-line'
  }
])

const search = ref('')
const selectedCourse = ref('')
const documents = ref([
  { id: 1, title: 'Matematik Notları', description: '1. Ünite özet', teacher: 'Ahmet Yılmaz', course: 'Matematik', date: '2024-05-01', url: '#' },
  { id: 2, title: 'Fizik Sunumu', description: 'Kuvvet ve Hareket', teacher: 'Ayşe Demir', course: 'Fizik', date: '2024-05-03', url: '#' },
  { id: 3, title: 'Kimya Deney Föyü', description: 'Asit-Baz Deneyi', teacher: 'Mehmet Kaya', course: 'Kimya', date: '2024-05-05', url: '#' },
])

const courses = computed(() => [...new Set(documents.value.map(d => d.course))])

const filteredDocuments = computed(() =>
  documents.value.filter(doc =>
    (doc.title.toLowerCase().includes(search.value.toLowerCase()) ||
     doc.description.toLowerCase().includes(search.value.toLowerCase())) &&
    (selectedCourse.value === '' || doc.course === selectedCourse.value)
  )
)
</script>

<style scoped>
.student-documents {
  padding: 32px;
}
.documents-search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.documents-search-bar input {
  flex: 1;
  padding: 14px 18px;
  border: 1.5px solid #bbb;
  border-radius: 8px;
  font-size: 1.15em;
  min-height: 48px;
  outline: none;
}
.documents-search-bar select {
  padding: 14px 18px;
  border: 1.5px solid #bbb;
  border-radius: 8px;
  font-size: 1.15em;
  min-height: 48px;
  outline: none;
}
.documents-list {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.document-item {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.document-item h3 {
  margin: 0 0 8px 0;
}
.document-item span {
  display: inline-block;
  margin-right: 16px;
  color: #666;
  font-size: 0.95em;
}
.document-item a {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 28px;
  color: #fff;
  background: #e91e63;
  border-radius: 6px;
  font-size: 1.08em;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(233,30,99,0.10);
  transition: background 0.2s, transform 0.2s;
  border: none;
  cursor: pointer;
}
.document-item a:hover {
  background: #ad1457;
  transform: translateY(-2px) scale(1.04);
}
</style>
