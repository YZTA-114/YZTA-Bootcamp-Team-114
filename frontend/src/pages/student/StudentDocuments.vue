<template>
  <DashboardLayout
    :user-name="userName"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :current-page="'Dokümanlar'"
    :notification-count="notificationCount"
  >
    <template #breadcrumb>
      <span>Dökümanlar</span>
    </template>
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="false" />
    </template>
    <template #content>
      <div class="student-documents">
        <div class="documents-header-block">
          <h1>Dokümanlar</h1>
          <p class="document-count">Toplam {{ documents.length }} dokümanınız var</p>
        </div>
        <div class="documents-content-wrapper">
          <div class="documents-header">
            <div class="header-left">
              <!-- <p class="document-count">Toplam {{ documents.length }} dokümanınız var</p> -->
            </div>
            <div class="header-right">
              <div class="header-actions">
                <button 
                  @click="showUploadModal = true"
                  class="upload-btn"
                  title="Doküman Ekle"
                >
                  <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Doküman Ekle</span>
                </button>
                
                <div class="view-controls">
                  <div class="view-mode-dropdown">
                    <button 
                      @click="toggleViewModeDropdown"
                      class="view-mode-toggle-btn"
                      title="Görünüm Modunu Değiştir"
                    >
                      <span>Görünüm Modu</span>
                      <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 4v6h6"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                      </svg>
                    </button>
                    
                    <div v-if="showViewModeDropdown" class="view-mode-options">
                      <div class="view-mode-header">
                        <h4>Görünüm Seçenekleri</h4>
                        <button class="close-view-mode-btn" @click="toggleViewModeDropdown">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      <div class="view-mode-buttons">
                        <button 
                          @click="selectViewMode('grid')" 
                          :class="{ active: viewMode === 'grid' }"
                          class="view-option-btn"
                        >
                          <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                          </svg>
                          <span>Grid Görünümü</span>
                        </button>
                        <button 
                          @click="selectViewMode('list')" 
                          :class="{ active: viewMode === 'list' }"
                          class="view-option-btn"
                        >
                          <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="6" x2="21" y2="6"/>
                            <line x1="8" y1="12" x2="21" y2="12"/>
                            <line x1="8" y1="18" x2="21" y2="18"/>
                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                            <line x1="3" y1="12" x2="3.01" y2="12"/>
                            <line x1="3" y1="18" x2="3.01" y2="18"/>
                          </svg>
                          <span>Liste Görünümü</span>
                        </button>
                        <button 
                          @click="selectViewMode('compact')" 
                          :class="{ active: viewMode === 'compact' }"
                          class="view-option-btn"
                        >
                          <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="6" x2="21" y2="6"/>
                            <line x1="8" y1="12" x2="21" y2="12"/>
                            <line x1="8" y1="18" x2="21" y2="18"/>
                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                            <line x1="3" y1="12" x2="3.01" y2="12"/>
                            <line x1="3" y1="18" x2="3.01" y2="18"/>
                          </svg>
                          <span>Kompakt Görünümü</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search and Filter Bar -->
          <div class="documents-search-bar">
            <div class="search-input-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input v-model="search" placeholder="Doküman ara..." />
            </div>
            
            <!-- Course Dropdown -->
            <div class="filter-dropdown">
              <button 
                @click="toggleCourseDropdown"
                class="filter-dropdown-btn"
                :class="{ active: showCourseDropdown }"
              >
                <div class="filter-btn-content">
                  <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                  <span class="filter-text">{{ selectedCourse || 'Tüm Dersler' }}</span>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              <div v-if="showCourseDropdown" class="filter-dropdown-menu">
                <div class="dropdown-header">
                  <h4>Ders Seçin</h4>
                  <button class="close-dropdown-btn" @click="toggleCourseDropdown">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div class="dropdown-options">
                  <button 
                    @click="selectCourse('')"
                    class="dropdown-option"
                    :class="{ selected: selectedCourse === '' }"
                  >
                    <span>Tüm Dersler</span>
                    <svg v-if="selectedCourse === ''" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </button>
                  <button 
                    v-for="c in courses" 
                    :key="c"
                    @click="selectCourse(c)"
                    class="dropdown-option"
                    :class="{ selected: selectedCourse === c }"
                  >
                    <span>{{ c }}</span>
                    <svg v-if="selectedCourse === c" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Category Dropdown -->
            <div class="filter-dropdown">
              <button 
                @click="toggleCategoryDropdown"
                class="filter-dropdown-btn"
                :class="{ active: showCategoryDropdown }"
              >
                <div class="filter-btn-content">
                  <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/>
                  </svg>
                  <span class="filter-text">{{ selectedCategory || 'Tüm Kategoriler' }}</span>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              <div v-if="showCategoryDropdown" class="filter-dropdown-menu">
                <div class="dropdown-header">
                  <h4>Kategori Seçin</h4>
                  <button class="close-dropdown-btn" @click="toggleCategoryDropdown">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div class="dropdown-options">
                  <button 
                    @click="selectCategory('')"
                    class="dropdown-option"
                    :class="{ selected: selectedCategory === '' }"
                  >
                    <span>Tüm Kategoriler</span>
                    <svg v-if="selectedCategory === ''" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </button>
                  <button 
                    v-for="cat in categories" 
                    :key="cat"
                    @click="selectCategory(cat)"
                    class="dropdown-option"
                    :class="{ selected: selectedCategory === cat }"
                  >
                    <span>{{ cat }}</span>
                    <svg v-if="selectedCategory === cat" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          

          <!-- Documents Content -->
          <div class="documents-content">
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="documents-grid">
              <div 
                v-for="doc in filteredDocuments" 
                :key="doc.id" 
                class="document-card"
                @click="selectDocument(doc)"
              >
                <div class="card-header">
                  <span class="category-tag" :class="getCategoryClass(doc.category)">{{ doc.category }}</span>
                  <button class="more-options">
                    <i class="ri-more-2-fill"></i>
                  </button>
                </div>
                <div class="document-preview">
                  <div class="preview-image">
                    <img 
                      :src="doc.fileType === 'pdf' ? 'https://via.placeholder.com/300x400/4caf50/ffffff?text=PDF+Dokümanı' : 
                           doc.fileType === 'doc' || doc.fileType === 'docx' ? 'https://via.placeholder.com/300x400/2196f3/ffffff?text=Word+Dokümanı' :
                           doc.fileType === 'ppt' || doc.fileType === 'pptx' ? 'https://via.placeholder.com/300x400/ff9800/ffffff?text=PowerPoint+Sunumu' :
                           doc.fileType === 'xls' || doc.fileType === 'xlsx' ? 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=Excel+Tablosu' :
                           'https://via.placeholder.com/300x400/666666/ffffff?text=Doküman'" 
                      :alt="doc.title" 
                    />
                    <div class="file-type-overlay">
                      <span class="file-type-badge">{{ doc.fileType ? doc.fileType.toUpperCase() : 'PDF' }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-content">
                  <h4 class="document-title">{{ doc.title }}</h4>
                  <p class="document-author">{{ doc.teacher }}</p>
                  <p class="document-date">{{ formatDate(doc.date) }}</p>
                </div>
                <div class="card-actions">
                  <div class="action-icons">
                    <button class="action-icon-btn" @click.stop="previewDocument(doc)" title="Görüntüle">
                      <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-icon-btn" @click.stop="downloadDocument(doc)" title="İndir">
                      <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                    <button class="action-icon-btn delete-btn" @click.stop="deleteDocument(doc)" title="Sil">
                      <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div v-else-if="viewMode === 'list'" class="documents-table">
              <table>
                <thead>
                  <tr>
                    <th>Doküman Adı</th>
                    <th>Kategori</th>
                    <th>Öğretmen</th>
                    <th>Ders</th>
                    <th>Tarih</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in filteredDocuments" :key="doc.id">
                    <td>
                      <div class="document-info">
                        <i class="ri-file-text-line"></i>
                        <span>{{ doc.title }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="category-badge" :class="getCategoryClass(doc.category)">{{ doc.category }}</span>
                    </td>
                    <td>{{ doc.teacher }}</td>
                    <td>{{ doc.course }}</td>
                    <td>{{ formatDate(doc.date) }}</td>
                                     <td>
                       <div class="action-buttons">
                         <button class="action-btn" @click="previewDocument(doc)" title="Görüntüle">
                           <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                             <circle cx="12" cy="12" r="3"/>
                           </svg>
                         </button>
                         <button class="action-btn" @click="downloadDocument(doc)" title="İndir">
                           <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                             <polyline points="7,10 12,15 17,10"/>
                             <line x1="12" y1="15" x2="12" y2="3"/>
                           </svg>
                         </button>
                         <button class="action-btn delete-btn" @click="deleteDocument(doc)" title="Sil">
                           <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <polyline points="3,6 5,6 21,6"/>
                             <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                             <line x1="10" y1="11" x2="10" y2="17"/>
                             <line x1="14" y1="11" x2="14" y2="17"/>
                           </svg>
                         </button>
                       </div>
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Compact View -->
            <div v-else class="documents-compact">
              <div v-for="doc in filteredDocuments" :key="doc.id" class="compact-item">
                <div class="compact-info">
                  <i class="ri-file-text-line"></i>
                  <div class="info-text">
                    <h4>{{ doc.title }}</h4>
                    <p>{{ doc.teacher }} • {{ doc.course }} • {{ formatDate(doc.date) }}</p>
                  </div>
                </div>
                             <div class="compact-actions">
                   <span class="category-tag" :class="getCategoryClass(doc.category)">{{ doc.category }}</span>
                   <div class="compact-action-icons">
                     <button class="action-icon-btn-small" @click="previewDocument(doc)" title="Görüntüle">
                       <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                         <circle cx="12" cy="12" r="3"/>
                       </svg>
                     </button>
                     <button class="action-icon-btn-small" @click="downloadDocument(doc)" title="İndir">
                       <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                         <polyline points="7,10 12,15 17,10"/>
                         <line x1="12" y1="15" x2="12" y2="3"/>
                       </svg>
                     </button>
                     <button class="action-icon-btn-small delete-btn" @click="deleteDocument(doc)" title="Sil">
                       <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <polyline points="3,6 5,6 21,6"/>
                         <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                         <line x1="10" y1="11" x2="10" y2="17"/>
                         <line x1="14" y1="11" x2="14" y2="17"/>
                       </svg>
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Document Preview Modal -->
          <div v-if="selectedDoc" class="document-preview-modal" @click="closePreview">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>{{ selectedDoc.title }}</h3>
                <button class="close-btn" @click="closePreview">
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="document-details">
                  <p><strong>Öğretmen:</strong> {{ selectedDoc.teacher }}</p>
                  <p><strong>Ders:</strong> {{ selectedDoc.course }}</p>
                  <p><strong>Kategori:</strong> {{ selectedDoc.category }}</p>
                  <p><strong>Tarih:</strong> {{ formatDate(selectedDoc.date) }}</p>
                </div>
                <div class="document-actions">
                  <button class="primary-btn" @click="downloadDocument(selectedDoc)">
                    <i class="ri-download-line"></i>
                    İndir
                  </button>
                  <button class="secondary-btn" @click="closePreview">
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Upload Document Modal -->
          <div v-if="showUploadModal" class="document-preview-modal" @click="closeUploadModal">
            <div class="modal-content upload-modal" @click.stop>
              <div class="modal-header">
                <h3>Yeni Doküman Ekle</h3>
                <button class="close-btn" @click="closeUploadModal">
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="uploadDocument" class="upload-form">
                  <div class="form-group">
                    <label for="documentTitle">Doküman Başlığı *</label>
                    <input 
                      id="documentTitle"
                      v-model="newDocument.title" 
                      type="text" 
                      placeholder="Doküman başlığını girin"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="documentDescription">Açıklama</label>
                    <textarea 
                      id="documentDescription"
                      v-model="newDocument.description" 
                      placeholder="Doküman açıklaması (opsiyonel)"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label for="documentCourse">Ders *</label>
                      <select 
                        id="documentCourse"
                        v-model="newDocument.course" 
                        required
                      >
                        <option value="">Ders seçin</option>
                        <option v-for="course in courses" :key="course" :value="course">
                          {{ course }}
                        </option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="documentCategory">Kategori *</label>
                      <select 
                        id="documentCategory"
                        v-model="newDocument.category" 
                        required
                      >
                        <option value="">Kategori seçin</option>
                        <option v-for="category in categories" :key="category" :value="category">
                          {{ category }}
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="documentFile">Dosya Seç *</label>
                    <div class="file-upload-area" @click="triggerFileInput">
                      <input 
                        ref="fileInput"
                        id="documentFile"
                        type="file" 
                        @change="handleFileSelect"
                        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                        style="display: none;"
                      />
                      <div v-if="!selectedFile" class="upload-placeholder">
                        <svg class="upload-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17,8 12,3 7,8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p>Dosya seçmek için tıklayın veya sürükleyin</p>
                        <span class="file-types">PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX</span>
                      </div>
                      <div v-else class="selected-file">
                        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        <div class="file-info">
                          <p class="file-name">{{ selectedFile.name }}</p>
                          <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                        </div>
                        <button type="button" class="remove-file-btn" @click="removeFile">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button type="button" class="secondary-btn" @click="closeUploadModal">
                      İptal
                    </button>
                    <button type="submit" class="primary-btn" :disabled="!isFormValid">
                      <svg class="upload-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17,8 12,3 7,8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Dokümanı Yükle
                    </button>
                  </div>
                </form>
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
    id: 'quizzes',
    label: 'Quizler',
    path: '/student/quizzes',
    icon: 'ri-task-line'
  },
  {
    id: 'documents',
    label: 'Dökümanlar',
    path: '/student/documents',
    icon: 'ri-file-text-line'
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
const selectedCategory = ref('')
const viewMode = ref('grid')
const selectedDoc = ref(null)
const showCourseDropdown = ref(false)
const showCategoryDropdown = ref(false)
const showViewModeDropdown = ref(false)
const showUploadModal = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const newDocument = ref({
  title: '',
  description: '',
  course: '',
  category: ''
})

const documents = ref([
  { 
    id: 1, 
    title: 'Matematik Notları', 
    description: '1. Ünite özet', 
    teacher: 'Ahmet Yılmaz', 
    course: 'Matematik', 
    category: 'Notlar',
    date: '2024-05-01', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/4caf50/ffffff?text=Matematik+Notları\\nPDF',
    fileType: 'pdf',
    fileName: 'matematik-notlari.pdf'
  },
  { 
    id: 2, 
    title: 'Fizik Sunumu', 
    description: 'Kuvvet ve Hareket', 
    teacher: 'Ayşe Demir', 
    course: 'Fizik', 
    category: 'Sunumlar',
    date: '2024-05-03', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/2196f3/ffffff?text=Fizik+Sunumu\\nPPT',
    fileType: 'ppt',
    fileName: 'fizik-sunumu.ppt'
  },
  { 
    id: 3, 
    title: 'Kimya Deney Föyü', 
    description: 'Asit-Baz Deneyi', 
    teacher: 'Mehmet Kaya', 
    course: 'Kimya', 
    category: 'Deneyler',
    date: '2024-05-05', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/ff9800/ffffff?text=Kimya+Deney+Föyü\\nPDF',
    fileType: 'pdf',
    fileName: 'kimya-deney-foyu.pdf'
  },
  { 
    id: 4, 
    title: 'Tarih Ödevi', 
    description: 'Osmanlı İmparatorluğu', 
    teacher: 'Fatma Özkan', 
    course: 'Tarih', 
    category: 'Ödevler',
    date: '2024-05-02', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=Tarih+Ödevi\\nDOC',
    fileType: 'doc',
    fileName: 'tarih-odevi.doc'
  },
  { 
    id: 5, 
    title: 'Coğrafya Haritası', 
    description: 'Türkiye Fiziki Haritası', 
    teacher: 'Ali Yıldız', 
    course: 'Coğrafya', 
    category: 'Haritalar',
    date: '2024-05-04', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/795548/ffffff?text=Coğrafya+Haritası\\nPDF',
    fileType: 'pdf',
    fileName: 'cografya-haritasi.pdf'
  },
  { 
    id: 6, 
    title: 'Biyoloji Laboratuvar Raporu', 
    description: 'Hücre İncelemesi', 
    teacher: 'Zeynep Arslan', 
    course: 'Biyoloji', 
    category: 'Raporlar',
    date: '2024-05-06', 
    url: '#',
    previewUrl: 'https://via.placeholder.com/300x400/607d8b/ffffff?text=Biyoloji+Raporu\\nPDF',
    fileType: 'pdf',
    fileName: 'biyoloji-raporu.pdf'
  }
])

const courses = computed(() => [...new Set(documents.value.map(d => d.course))])
const categories = computed(() => [...new Set(documents.value.map(d => d.category))])

const filteredDocuments = computed(() =>
  documents.value.filter(doc =>
    (doc.title.toLowerCase().includes(search.value.toLowerCase()) ||
     doc.description.toLowerCase().includes(search.value.toLowerCase())) &&
    (selectedCourse.value === '' || doc.course === selectedCourse.value) &&
    (selectedCategory.value === '' || doc.category === selectedCategory.value)
)
)

const getCategoryClass = (category) => {
  const categoryClasses = {
    'Notlar': 'category-notes',
    'Sunumlar': 'category-presentations',
    'Deneyler': 'category-experiments',
    'Ödevler': 'category-assignments',
    'Haritalar': 'category-maps',
    'Raporlar': 'category-reports'
  }
  return categoryClasses[category] || 'category-default'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 gün önce'
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  return date.toLocaleDateString('tr-TR')
}

const selectDocument = (doc) => {
  selectedDoc.value = doc
}

const closePreview = () => {
  selectedDoc.value = null
}

const downloadDocument = (doc) => {
  // Simulate download
  console.log('Downloading:', doc.title)
  // In real implementation, this would trigger actual download
}

const previewDocument = (doc) => {
  selectDocument(doc)
}

const deleteDocument = (doc) => {
  // Silme işlemi için onay al
  if (confirm(`${doc.title} dokümanını silmek istediğinizden emin misiniz?`)) {
    // Dokümanı listeden kaldır
    const index = documents.value.findIndex(d => d.id === doc.id)
    if (index > -1) {
      documents.value.splice(index, 1)
    }
    console.log('Document deleted:', doc.title)
  }
}

const toggleCourseDropdown = () => {
  showCourseDropdown.value = !showCourseDropdown.value
  showCategoryDropdown.value = false
}

const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
  showCourseDropdown.value = false
}

const selectCourse = (course) => {
  selectedCourse.value = course
  showCourseDropdown.value = false
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

const toggleViewModeDropdown = () => {
  showViewModeDropdown.value = !showViewModeDropdown.value
  showCourseDropdown.value = false
  showCategoryDropdown.value = false
}

const selectViewMode = (mode) => {
  viewMode.value = mode
  showViewModeDropdown.value = false
}

const isFormValid = computed(() => {
  return newDocument.value.title.trim() !== '' && 
         newDocument.value.course !== '' && 
         newDocument.value.category !== '' && 
         selectedFile.value !== null
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const closeUploadModal = () => {
  showUploadModal.value = false
  // Reset form
  newDocument.value = {
    title: '',
    description: '',
    course: '',
    category: ''
  }
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const generatePreviewUrl = (file, title) => {
  // Get file extension
  const extension = file.name.split('.').pop().toLowerCase()
  
  // Generate a color based on file type
  const colorMap = {
    'pdf': '4caf50',
    'doc': '2196f3',
    'docx': '2196f3',
    'ppt': 'ff9800',
    'pptx': 'ff9800',
    'xls': '9c27b0',
    'xlsx': '9c27b0',
    'txt': '607d8b'
  }
  
  const color = colorMap[extension] || '666666'
  
  // Create a more realistic document preview with better styling
  const previewText = title.length > 15 ? title.substring(0, 15) + '...' : title
  const fileTypeText = extension.toUpperCase()
  
  // Create a more sophisticated preview with file type indicator
  return `https://via.placeholder.com/300x400/${color}/ffffff?text=${encodeURIComponent(previewText + '\\n' + fileTypeText)}`
}

const uploadDocument = async () => {
  if (!isFormValid.value) return

  let fileType = selectedFile.value.name.split('.').pop().toLowerCase()
  
  // Generate preview URL for all file types
  const previewUrl = generatePreviewUrl(selectedFile.value, newDocument.value.title)
  console.log('Generated previewUrl:', previewUrl)

  const documentData = {
    id: Date.now(),
    title: newDocument.value.title,
    description: newDocument.value.description,
    teacher: 'John Doe',
    course: newDocument.value.course,
    category: newDocument.value.category,
    date: new Date().toISOString().split('T')[0],
    url: '#',
    fileName: selectedFile.value.name,
    fileSize: selectedFile.value.size,
    previewUrl: previewUrl,
    fileType: fileType
  }
  
  console.log('Document data:', documentData)
  documents.value.unshift(documentData)
  closeUploadModal()
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.student-documents {
  padding: 32px;
  background: $black;
  min-height: 100vh;
  .documents-header-block {
    background: $orange;
    border-radius: $space-s;
    padding: $space-m $space-l;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 4px 16px rgba($orange, 0.10);
    margin-bottom: $space-xs;
    h1 {
      color: $white;
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      font-family: $font-family-primary-bold;
      margin: 0 0 $space-3xs 0;
    }
    .document-count {
      color: $white;
      font-size: $font-size-s;
      font-weight: $font-weight-semi-bold;
      margin: 0;
    }
  }
  .documents-content-wrapper {
    background: $white;
    border-radius: $space-s;
    box-shadow: 0 4px 16px rgba($black, 0.06);
    padding: $space-xl;
    margin-top: 0;
    @media (max-width: 700px) {
      padding: $space-m $space-s;
    }
  }
  .documents-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-m;
    .header-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: $grey;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
}

/* Header Styles */
.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.document-count {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: $orange;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba($orange, 0.3);
}

.upload-btn:hover {
  background: darken($orange, 10%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba($orange, 0.4);
}

.upload-icon {
  width: 16px;
  height: 16px;
}

.view-controls {
  display: flex;
  align-items: center;
}

.view-mode-dropdown {
  position: relative;
}

.view-mode-toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e91e63;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.view-mode-toggle-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.view-mode-toggle-btn:hover .toggle-icon {
  transform: rotate(180deg);
}

.view-mode-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid #eee;
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
}

.view-mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.view-mode-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.close-view-mode-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
}

.close-view-mode-btn:hover {
  background: #e9ecef;
  color: #333;
}

.close-view-mode-btn svg {
  width: 16px;
  height: 16px;
}

.view-mode-buttons {
  padding: 12px;
}

.view-option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
}

.view-option-btn:hover {
  background: #f8f9fa;
}

.view-option-btn.active {
  background: #e91e63;
  color: white;
}

.view-option-btn.active:hover {
  background: #ad1457;
}

.view-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}



/* Search Bar Styles */
.documents-search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  width: 20px;
  height: 20px;
}

.documents-search-bar input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e91e63;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.documents-search-bar input:focus {
  border-color: #e91e63;
}

/* Filter Dropdown Styles */
.filter-dropdown {
  position: relative;
  min-width: 180px;
}

.filter-dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  background: white;
  border: 2px solid #e91e63;
  border-radius: 12px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-dropdown-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.filter-dropdown-btn.active {
  border-color: #ad1457;
  box-shadow: 0 4px 16px rgba(233, 30, 99, 0.2);
}

.filter-btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-icon {
  width: 18px;
  height: 18px;
  color: #e91e63;
  flex-shrink: 0;
}

.filter-text {
  font-weight: 500;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.filter-dropdown-btn.active .dropdown-arrow {
  transform: rotate(180deg);
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid #eee;
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlide 0.3s ease;
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

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.dropdown-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.close-dropdown-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: #666;
  transition: all 0.2s;
}

.close-dropdown-btn:hover {
  background: #e9ecef;
  color: #333;
}

.close-dropdown-btn svg {
  width: 16px;
  height: 16px;
}

.dropdown-options {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-option:hover {
  background: #f8f9fa;
}

.dropdown-option.selected {
  background: #e91e63;
  color: white;
}

.dropdown-option.selected:hover {
  background: #ad1457;
}

.check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Grid View Styles */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.document-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.category-notes { background: #4caf50; }
.category-presentations { background: #2196f3; }
.category-experiments { background: #ff9800; }
.category-assignments { background: #9c27b0; }
.category-maps { background: #795548; }
.category-reports { background: #607d8b; }
.category-default { background: #666; }

.more-options {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.more-options:hover {
  background: #f5f5f5;
}

.document-preview {
  height: 160px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 2px dashed #ddd;
  overflow: hidden;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.document-card:hover .preview-image img {
  transform: scale(1.05);
}

.file-type-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.file-type-badge {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.preview-placeholder i {
  font-size: 2.5rem;
  color: #666;
}

.preview-text {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

.generate-preview-text {
  font-size: 0.7rem;
  color: #e91e63;
  text-align: center;
  margin-top: 4px;
  font-weight: 500;
}

.preview-placeholder {
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-placeholder:hover {
  background: #f0f0f0;
  border-color: #e91e63;
}

.icon-svg {
  width: 16px;
  height: 16px;
  color: #666;
  transition: color 0.2s;
}

.action-icon-btn:hover .icon-svg {
  color: #333;
}

.action-icon-btn.delete-btn:hover .icon-svg {
  color: #d32f2f;
}

.card-content {
  margin-bottom: 16px;
}

.document-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.document-author {
  margin: 0 0 4px 0;
  color: #666;
  font-size: 0.9rem;
}

.document-date {
  margin: 0;
  color: #999;
  font-size: 0.8rem;
}

.card-actions {
  margin-top: 16px;
}

.action-icons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  color: #000;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.action-icon-btn:hover {
  background: #e0e0e0;
  color: #000;
  transform: translateY(-1px);
}

.action-icon-btn.delete-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* Table View Styles */
.documents-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.documents-table table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table th {
  background: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 1px solid #eee;
}

.documents-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.document-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.document-info i {
  font-size: 1.2rem;
  color: #666;
}

.document-info .icon-text {
  font-size: 1.2rem;
}

.category-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn .icon-svg {
  width: 14px;
  height: 14px;
}

.action-btn:hover {
  background: #f5f5f5;
  color: #e91e63;
}

.action-btn.delete-btn {
  color: #666;
}

.action-btn.delete-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* Compact View Styles */
.documents-compact {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.compact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.compact-item:last-child {
  border-bottom: none;
}

.compact-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.compact-info i {
  font-size: 1.5rem;
  color: #666;
}

.compact-info .icon-text {
  font-size: 1.5rem;
}

.info-text h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #1a1a1a;
}

.info-text p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.compact-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.compact-action-icons {
  display: flex;
  gap: 6px;
}

.action-icon-btn-small {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-btn-small .icon-svg {
  width: 14px;
  height: 14px;
}

.action-icon-btn-small:hover {
  background: #e0e0e0;
  color: #000;
  transform: translateY(-1px);
}

.action-icon-btn-small.delete-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* Modal Styles */
.document-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 24px;
}

.document-details p {
  margin: 0 0 12px 0;
  color: #666;
}

.document-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.primary-btn, .secondary-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background: $orange;
  color: white;
}

.primary-btn:hover {
  background: darken($orange, 10%);
}

.secondary-btn {
  background: #f5f5f5;
  color: #666;
}

.secondary-btn:hover {
  background: #e0e0e0;
}

/* Upload Modal Styles */
.upload-modal {
  max-width: 600px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: $orange;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.file-upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.file-upload-area:hover {
  border-color: $orange;
  background: #f0f0f0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon-large {
  width: 48px;
  height: 48px;
  color: #666;
}

.upload-placeholder p {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.file-types {
  font-size: 12px;
  color: #666;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.file-icon {
  width: 32px;
  height: 32px;
  color: #666;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.file-size {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.remove-file-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #666;
  transition: all 0.2s;
}

.remove-file-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.remove-file-btn svg {
  width: 16px;
  height: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.upload-icon-small {
  width: 16px;
  height: 16px;
}

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.primary-btn:disabled:hover {
  background: #ccc;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .documents-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .upload-btn {
    width: 100%;
    justify-content: center;
  }
  
  .documents-search-bar {
    flex-direction: column;
  }
  
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .documents-table {
    overflow-x: auto;
  }
  
  .compact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .compact-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>
