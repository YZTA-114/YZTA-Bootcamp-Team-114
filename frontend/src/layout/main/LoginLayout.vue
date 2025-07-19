<template>
  <div class="login-layout">
    <div class="login-layout__logo">
      <BrandLogo :width="80" :height="80" />
    </div>
    <div class="login-layout__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
import BrandLogo from '@/components/custom/logo/BrandLogo.vue';
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.login-layout {
  display: flex;
  min-height: 100vh;
  background: $black;
  align-items: center;
  justify-content: center;
  position: relative;
}
.login-layout__logo {
  position: absolute;
  top: $space-xl;
  left: $space-xl;
  z-index: 10;
}
.login-layout__right {
  background: $white;
  border-radius: $space-xl;
  min-width: 480px;
  width: 520px;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
@media (max-width: 900px) {
  .login-layout__right {
    min-width: 90vw;
    width: 95vw;
    min-height: 400px;
    border-radius: $space-xl;
  }
  .login-layout__logo {
    top: $space-m;
    left: $space-m;
  }
}
</style> 