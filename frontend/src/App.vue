<template>
  <router-view />
</template>

<script setup>
</script>

<style lang="scss">
@import "./assets/custom-vue/scss/styles";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: #181a1f !important;
  scrollbar-width: none;
}
</style>
