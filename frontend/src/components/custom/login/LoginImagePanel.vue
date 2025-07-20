<template>
  <div class="login-image-panel">
    <div class="login-image-panel__image">
      <img :src="imageSrc" alt="Login görseli" />
    </div>
    <div class="login-image-panel__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const imageSrc = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'; // placeholder
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.login-image-panel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.login-image-panel__image {
  width: 100%;
  height: 100%;
  min-height: 350px;
  overflow: hidden;
  border-radius: $space-xl 0 0 $space-xl;
}
.login-image-panel__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.login-image-panel__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 2;
  padding: $space-l;
  pointer-events: none;
}
</style> 