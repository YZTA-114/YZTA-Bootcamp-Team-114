<template>
  <DashboardLayout 
    :current-page="currentPage"
    :user-name="userName"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :notification-count="notificationCount"
    :is-sidebar-collapsed="isSidebarCollapsed"
  >
    <template #main-content>
      <div class="teacher-analytics">
        <!-- Header Section -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">Analitik</h1>
            <p class="page-subtitle">Öğrenci performansını ve sınıf istatistiklerini analiz edin</p>
            <div class="header-actions">
              <button class="btn btn-primary" @click="exportReport">
                <ri-download-line />
                Rapor İndir
              </button>
            </div>
          </div>
        </div>

    <!-- Stats Overview -->
    <div class="stats-gradient-box">
      <div class="stat-col">
        <div class="stat-header-row">
          <div class="stat-bigicon">
            <ri-user-line />
          </div>
          <div class="stat-percent">+12%</div>
        </div>
        <div class="stat-title">Toplam Öğrenci</div>
        <div class="stat-value">156</div>
        <div class="stat-divider"></div>
        <div class="stat-subtitle">Geçen ay: 139</div>
      </div>
      
      <div class="stat-col">
        <div class="stat-header-row">
          <div class="stat-bigicon">
            <ri-book-line />
          </div>
          <div class="stat-percent">+8%</div>
        </div>
        <div class="stat-title">Aktif Ders</div>
        <div class="stat-value">24</div>
        <div class="stat-divider"></div>
        <div class="stat-subtitle">Geçen ay: 22</div>
      </div>
      
      <div class="stat-col">
        <div class="stat-header-row">
          <div class="stat-bigicon">
            <ri-bar-chart-line />
          </div>
          <div class="stat-percent">+15%</div>
        </div>
        <div class="stat-title">Ortalama Başarı</div>
        <div class="stat-value">87%</div>
        <div class="stat-divider"></div>
        <div class="stat-subtitle">Geçen ay: 76%</div>
      </div>
      
      <div class="stat-col">
        <div class="stat-header-row">
          <div class="stat-bigicon">
            <ri-time-line />
          </div>
          <div class="stat-percent">+5%</div>
        </div>
        <div class="stat-title">Katılım Oranı</div>
        <div class="stat-value">94%</div>
        <div class="stat-divider"></div>
        <div class="stat-subtitle">Geçen ay: 89%</div>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="analytics-grid">
      <!-- Performance Chart -->
      <div class="analytics-card performance-chart">
        <div class="card-header">
          <h3>Öğrenci Performans Grafiği</h3>
          <div class="card-actions">
            <select v-model="selectedPeriod" class="period-select">
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="quarter">Bu Çeyrek</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <ri-bar-chart-2-line class="chart-icon" />
            <p>Performans grafiği burada görüntülenecek</p>
          </div>
        </div>
      </div>

      <!-- Class Performance -->
      <div class="analytics-card class-performance">
        <div class="card-header">
          <h3>Sınıf Performansı</h3>
          <button class="btn btn-outline" @click="viewAllClasses">
            Tümünü Gör
          </button>
        </div>
        <div class="class-list">
          <div v-for="classItem in topClasses" :key="classItem.id" class="class-item">
            <div class="class-info">
              <h4>{{ classItem.name }}</h4>
              <p>{{ classItem.students }} öğrenci</p>
            </div>
            <div class="class-stats">
              <div class="stat-item">
                <span class="stat-label">Başarı</span>
                <span class="stat-value" :class="getPerformanceClass(classItem.performance)">
                  {{ classItem.performance }}%
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Katılım</span>
                <span class="stat-value">{{ classItem.attendance }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="analytics-card recent-activity">
        <div class="card-header">
          <h3>Son Aktiviteler</h3>
          <button class="btn btn-outline" @click="viewAllActivities">
            Tümünü Gör
          </button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <ri-user-line v-if="activity.type === 'student'" />
              <ri-book-line v-if="activity.type === 'class'" />
              <ri-task-line v-if="activity.type === 'quiz'" />
              <ri-award-line v-if="activity.type === 'achievement'" />
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Insights -->
      <div class="analytics-card quick-insights">
        <div class="card-header">
          <h3>Hızlı İçgörüler</h3>
        </div>
        <div class="insights-list">
          <div v-for="insight in insights" :key="insight.id" class="insight-item">
            <div class="insight-icon" :class="insight.type">
              <ri-arrow-up-line v-if="insight.type === 'positive'" />
              <ri-arrow-down-line v-if="insight.type === 'negative'" />
              <ri-information-line v-if="insight.type === 'info'" />
            </div>
            <div class="insight-content">
              <p class="insight-text">{{ insight.text }}</p>
              <span class="insight-value">{{ insight.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue'

// User data
const userName = ref('Dr. Sarah Johnson')
const userRole = ref('Teacher')
const userAvatar = ref('/default-avatar.png')
const currentPage = ref('Analitik')
const notificationCount = ref(5)
const isSidebarCollapsed = ref(false)

const selectedPeriod = ref('month')
    
    const topClasses = ref([
      { id: 1, name: 'Matematik 10A', students: 28, performance: 92, attendance: 96 },
      { id: 2, name: 'Fizik 11B', students: 24, performance: 88, attendance: 94 },
      { id: 3, name: 'Kimya 12C', students: 22, performance: 85, attendance: 91 },
      { id: 4, name: 'Biyoloji 9A', students: 30, performance: 82, attendance: 89 }
    ])

    const recentActivities = ref([
      { id: 1, type: 'quiz', text: 'Matematik sınıfında yeni quiz oluşturuldu', time: '2 saat önce' },
      { id: 2, type: 'student', text: 'Ahmet Yılmaz ödevini tamamladı', time: '3 saat önce' },
      { id: 3, type: 'achievement', text: 'Fizik sınıfı %95 başarı oranına ulaştı', time: '5 saat önce' },
      { id: 4, type: 'class', text: 'Kimya dersi planlandı', time: '1 gün önce' },
      { id: 5, type: 'student', text: 'Ayşe Demir yeni kayıt oldu', time: '1 gün önce' }
    ])

    const insights = ref([
      { id: 1, type: 'positive', text: 'Ortalama başarı oranı artışı', value: '+11%' },
      { id: 2, type: 'positive', text: 'Öğrenci katılım oranı', value: '+5%' },
      { id: 3, type: 'info', text: 'En aktif sınıf', value: 'Matematik 10A' },
      { id: 4, type: 'negative', text: 'Düşük performanslı öğrenci sayısı', value: '3 öğrenci' }
    ])

    const getPerformanceClass = (performance) => {
      if (performance >= 90) return 'high-score'
      if (performance >= 80) return 'mid-score'
      return 'low-score'
    }

    const exportReport = () => {
      console.log('Rapor indiriliyor...')
    }

    const viewAllClasses = () => {
      console.log('Tüm sınıflar görüntüleniyor...')
    }

    const viewAllActivities = () => {
      console.log('Tüm aktiviteler görüntüleniyor...')
    }

    onMounted(() => {
      console.log('Teacher analytics page mounted')
    })
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/variable';

.teacher-analytics {
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

  .analytics-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $space-l;
    margin-bottom: $space-l;

    .analytics-card {
      background: $white;
      border-radius: 12px;
      padding: $space-l;
      box-shadow: 0 4px 24px rgba($black, 0.10);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $space-l;

        h3 {
          font-size: $font-size-l;
          font-weight: $font-weight-semi-bold;
          margin: 0;
          color: $black;
        }

        .period-select {
          padding: $space-xs $space-s;
          border: 1px solid rgba($black, 0.2);
          border-radius: 6px;
          background: $white;
          color: $black;
          font-size: $font-size-s;
          outline: none;

          &:focus {
            border-color: $orange;
          }
        }

        .btn {
          background: transparent;
          border: 1px solid rgba($black, 0.2);
          color: $black;
          padding: $space-xs $space-s;
          border-radius: 6px;
          font-size: $font-size-s;
          transition: all 0.2s;

          &:hover {
            background: rgba($black, 0.05);
          }
        }
      }

      &.performance-chart {
        grid-column: 1;
        grid-row: 1;

        .chart-container {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba($black, 0.02);
          border-radius: 8px;

          .chart-placeholder {
            text-align: center;
            color: rgba($black, 0.6);

            .chart-icon {
              font-size: 48px;
              margin-bottom: $space-s;
              color: $orange;
            }

            p {
              margin: 0;
              font-size: $font-size-s;
            }
          }
        }
      }

      &.class-performance {
        grid-column: 2;
        grid-row: 1;

        .class-list {
          .class-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: $space-s 0;
            border-bottom: 1px solid rgba($black, 0.1);

            &:last-child {
              border-bottom: none;
            }

            .class-info {
              h4 {
                font-size: $font-size-s;
                font-weight: $font-weight-semi-bold;
                margin: 0 0 2px 0;
                color: $black;
              }

              p {
                font-size: $font-size-xs;
                color: rgba($black, 0.6);
                margin: 0;
              }
            }

            .class-stats {
              display: flex;
              gap: $space-m;

              .stat-item {
                text-align: center;

                .stat-label {
                  display: block;
                  font-size: $font-size-xs;
                  color: rgba($black, 0.6);
                  margin-bottom: 2px;
                }

                .stat-value {
                  font-size: $font-size-s;
                  font-weight: $font-weight-semi-bold;
                  color: $black;

                  &.high-score {
                    color: #10b981;
                  }

                  &.mid-score {
                    color: #f59e0b;
                  }

                  &.low-score {
                    color: #ef4444;
                  }
                }
              }
            }
          }
        }
      }

      &.recent-activity {
        grid-column: 1;
        grid-row: 2;

        .activity-list {
          .activity-item {
            display: flex;
            align-items: center;
            gap: $space-s;
            padding: $space-s 0;
            border-bottom: 1px solid rgba($black, 0.1);

            &:last-child {
              border-bottom: none;
            }

            .activity-icon {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              color: $white;

              &.student {
                background: #3b82f6;
              }

              &.class {
                background: #10b981;
              }

              &.quiz {
                background: #f59e0b;
              }

              &.achievement {
                background: #8b5cf6;
              }
            }

            .activity-content {
              flex: 1;

              .activity-text {
                font-size: $font-size-s;
                color: $black;
                margin: 0 0 2px 0;
              }

              .activity-time {
                font-size: $font-size-xs;
                color: rgba($black, 0.6);
              }
            }
          }
        }
      }

      &.quick-insights {
        grid-column: 2;
        grid-row: 2;

        .insights-list {
          .insight-item {
            display: flex;
            align-items: center;
            gap: $space-s;
            padding: $space-s 0;
            border-bottom: 1px solid rgba($black, 0.1);

            &:last-child {
              border-bottom: none;
            }

            .insight-icon {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: $white;

              &.positive {
                background: #10b981;
              }

              &.negative {
                background: #ef4444;
              }

              &.info {
                background: #3b82f6;
              }
            }

            .insight-content {
              flex: 1;

              .insight-text {
                font-size: $font-size-s;
                color: $black;
                margin: 0 0 2px 0;
              }

              .insight-value {
                font-size: $font-size-xs;
                font-weight: $font-weight-semi-bold;
                color: rgba($black, 0.7);
              }
            }
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
  font-weight: $font-weight-semi-bold;
  margin: 0 0 $space-xs 0;
}

.stat-value {
  color: #222;
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  margin: 0 0 $space-xs 0;
}

.stat-subtitle {
  color: #666;
  font-size: $font-size-s;
  margin: 0;
}

.stat-divider {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: $space-xs 0;
}

.stat-bigicon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, $orange, #ca6f1e);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  font-size: 24px;
  margin-bottom: $space-xs;
}

.stat-percent {
  color: #10b981;
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  margin-left: $space-xs;
}

.high-score {
  color: #10b981 !important;
}

.mid-score {
  color: #f59e0b !important;
}

.low-score {
  color: #ef4444 !important;
}
</style> 