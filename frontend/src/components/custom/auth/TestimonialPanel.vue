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
        <span class="testimonial-panel__logo-text">INVESBULL</span>
      </div>
      
      <div class="testimonial-panel__testimonial">
        <p class="testimonial-panel__quote">
          "I'VE BEEN USING THIS STOCK MARKET APP FOR A FEW WEEKS. IT PROVIDES A TON OF USEFUL INFORMATION ABOUT DIFFERENT STOCKS AND MARKETS. I PARTICULARLY LIKE THE REAL-TIME UPDATES AND ALERTS, WHICH HELP ME STAY ON TOP OF ANY CHANGES OR OPPORTUNITIES IN MY PORTFOLIO."
        </p>
      </div>
      
      <div class="testimonial-panel__pagination">
        <div class="testimonial-panel__dot testimonial-panel__dot--active"></div>
        <div class="testimonial-panel__dot"></div>
        <div class="testimonial-panel__dot"></div>
        <div class="testimonial-panel__dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this component
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
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
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

.testimonial-panel__dot {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  transition: background 0.3s;

  &--active {
    background: $white;
  }
}

@media (max-width: 900px) {
  .testimonial-panel {
    display: none;
  }
}
</style> 