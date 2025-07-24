<template>
  <div class="testimonial-panel">
    <div class="testimonial-panel__background">
      <div class="testimonial-panel__overlay"></div>
    </div>
    
    <div class="testimonial-panel__content">
      <div class="testimonial-panel__logo">
        <div class="testimonial-panel__logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="16" r="8" stroke="white" stroke-width="2"/>
          </svg>
        </div>
      </div>
      
      <div class="testimonial-panel__testimonial">
        <div class="testimonial-panel__visual-showcase">
          <div class="testimonial-panel__image-carousel">
            <div class="testimonial-panel__carousel-item testimonial-panel__carousel-item--active">
              <img 
                src="@/assets/images/team-386673_1280.jpg" 
                alt="Takım çalışması ve birlik - Görme engelli ve gören bireyler birlikte" 
                class="testimonial-panel__carousel-image"
              />
              <div class="testimonial-panel__carousel-overlay">
                <h3 class="testimonial-panel__carousel-title">Birlik ve Dayanışma</h3>
                <p class="testimonial-panel__carousel-subtitle">Herkes için eğitim fırsatları</p>
              </div>
            </div>
            <div class="testimonial-panel__carousel-item">
              <img 
                src="@/assets/images/a_dark-themed_modern_and_professional_background_smooth_gradient_transitions_in_deep_navy_and_charc_4a.png" 
                alt="Modern dijital eğitim ve AI teknolojisi - Koyu tema profesyonel arka plan" 
                class="testimonial-panel__carousel-image testimonial-panel__carousel-image--dark-theme"
              />
              <div class="testimonial-panel__carousel-overlay">
                <h3 class="testimonial-panel__carousel-title">AI Destekli Eğitim</h3>
                <p class="testimonial-panel__carousel-subtitle">Yapay zeka ile kişiselleştirilmiş öğrenme</p>
              </div>
            </div>
            <div class="testimonial-panel__carousel-item">
              <img 
                src="@/assets/images/nk-ni-wgS7Iz0Chtg-unsplash.jpg" 
                alt="Modern teknoloji ve eğitim - İnteraktif dijital öğrenme ortamı" 
                class="testimonial-panel__carousel-image"
              />
              <div class="testimonial-panel__carousel-overlay">
                <h3 class="testimonial-panel__carousel-title">İnteraktif Teknoloji</h3>
                <p class="testimonial-panel__carousel-subtitle">Modern dijital öğrenme araçları</p>
              </div>
            </div>
            <div class="testimonial-panel__carousel-item">
              <img 
                src="@/assets/images/team-386673_1920.jpg" 
                alt="Yüksek kaliteli takım çalışması - Görme engelli ve gören bireyler birlikte öğreniyor" 
                class="testimonial-panel__carousel-image"
              />
              <div class="testimonial-panel__carousel-overlay">
                <h3 class="testimonial-panel__carousel-title">Birlikte Öğrenme</h3>
                <p class="testimonial-panel__carousel-subtitle">Yüksek kaliteli eğitim deneyimi</p>
              </div>
            </div>
          </div>
          <div class="testimonial-panel__carousel-controls">
            <button @click="prevSlide" class="testimonial-panel__carousel-btn testimonial-panel__carousel-btn--prev">‹</button>
            <button @click="nextSlide" class="testimonial-panel__carousel-btn testimonial-panel__carousel-btn--next">›</button>
          </div>
        </div>
      </div>
      
      <div class="testimonial-panel__pagination">
        <div class="testimonial-panel__progress-container">
          <div @click="goToSlide(0)" class="testimonial-panel__progress-bar testimonial-panel__progress-bar--active"></div>
          <div @click="goToSlide(1)" class="testimonial-panel__progress-bar"></div>
          <div @click="goToSlide(2)" class="testimonial-panel__progress-bar"></div>
          <div @click="goToSlide(3)" class="testimonial-panel__progress-bar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const totalSlides = 4
let autoPlayInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
  updateCarousel()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides - 1 : currentSlide.value - 1
  updateCarousel()
}

const goToSlide = (index) => {
  currentSlide.value = index
  updateCarousel()
}

const updateCarousel = () => {
  const items = document.querySelectorAll('.testimonial-panel__carousel-item')
  const progressBars = document.querySelectorAll('.testimonial-panel__progress-bar')
  
  items.forEach((item, index) => {
    if (index === currentSlide.value) {
      item.classList.add('testimonial-panel__carousel-item--active')
    } else {
      item.classList.remove('testimonial-panel__carousel-item--active')
    }
  })
  
  progressBars.forEach((bar, index) => {
    if (index === currentSlide.value) {
      bar.classList.add('testimonial-panel__progress-bar--active')
    } else {
      bar.classList.remove('testimonial-panel__progress-bar--active')
    }
  })
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 6000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.testimonial-panel {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $space-m;
  background: $pink;
  border-radius: 0 $space-xl $space-xl 0;
  overflow: hidden;
}

.testimonial-panel__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><defs><filter id="blur"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="400" height="600" fill="%23344a5e"/><circle cx="300" cy="200" r="80" fill="%232c3e50" filter="url(%23blur)"/><circle cx="100" cy="400" r="60" fill="%232c3e50" filter="url(%23blur)"/></svg>') center/cover;
  opacity: 0.3;
}

.testimonial-panel__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.testimonial-panel__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.testimonial-panel__logo {
  display: flex;
  align-items: center;
  gap: $space-xs;
  margin-bottom: $space-m;
}

.testimonial-panel__logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-panel__logo-text {
  color: $white;
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
  letter-spacing: 0.1em;
}

.testimonial-panel__testimonial {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-m 0;
}

.testimonial-panel__visual-showcase {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: $space-m;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.testimonial-panel__image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.testimonial-panel__carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;

  &--active {
    opacity: 1;
    z-index: 2;
  }
}

.testimonial-panel__carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  
  &--dark-theme {
    object-position: 20% center;
  }
}

.testimonial-panel__carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $space-m;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: $white;
  text-align: center;
  z-index: 3;
}

.testimonial-panel__carousel-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
  margin-bottom: $space-xs;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.testimonial-panel__carousel-subtitle {
  font-size: $font-size-m;
  font-weight: $font-weight-regular;
  font-family: $font-family-primary-regular;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.testimonial-panel__carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $space-m;
  z-index: 4;
}

.testimonial-panel__carousel-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: $white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: $font-size-xl;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.testimonial-panel__carousel-indicators {
  display: flex;
  gap: $space-xs;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.testimonial-panel__indicator {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: background-color 0.3s;

  &--active {
    background-color: $white;
  }
}

.testimonial-panel__quote {
  color: $white;
  font-size: $font-size-m;
  font-weight: $font-weight-regular;
  font-family: $font-family-primary-regular;
  line-height: 1.6;
  text-align: center;
  max-width: 400px;
  margin: 0;
}

.testimonial-panel__pagination {
  display: flex;
  gap: $space-xs;
  justify-content: center;
  margin-top: $space-m;
}

.testimonial-panel__progress-container {
  display: flex;
  gap: $space-xs;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.testimonial-panel__progress-bar {
  flex: 1;
  max-width: 80px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scaleY(1.2);
  }

  &--active {
    background: $white;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .testimonial-panel {
    display: none;
  }
}
</style> 