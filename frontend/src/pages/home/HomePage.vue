<template>
  <MainLayout>
    <template #content>
      <div class="home-page">
        <div class="home-container">
          <h1 class="home-title">This is frontend project base</h1>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layout/main/MainLayout.vue";
</script>

<style lang="scss">
@import "@/assets/scss/custom";

.home-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.home-container {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.home-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 3rem;
  color: #000;
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}
</style>
