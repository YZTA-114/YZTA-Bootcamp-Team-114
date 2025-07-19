<template>
  <div class="login-layout">
    <div class="login-layout__left">
      <slot name="left" />
    </div>
    <div class="login-layout__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
// No imports needed
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.login-layout {
  display: flex;
  min-height: 100vh;
  background: $white;
}

.login-layout__left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-m;
  background: $white;
  min-height: 100vh;
  overflow-y: auto;
}

.login-layout__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: $space-xl 0 0 $space-xl;
  overflow: hidden;
  min-height: 100vh;
}

@media (max-width: 900px) {
  .login-layout {
    flex-direction: column;
  }
  
  .login-layout__left {
    flex: none;
    min-height: 100vh;
    padding: $space-s;
  }
  
  .login-layout__right {
    display: none;
  }
}

@media (max-height: 700px) {
  .login-layout__left {
    padding: $space-xs;
  }
}
</style> 