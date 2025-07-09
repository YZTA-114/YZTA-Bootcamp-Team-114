<template>
    <div class="header">
      <slot name="header">
        <HomeNavbarComponent />
      </slot>
    </div>
  
    <main>
      <div class="content">
        <slot name="content">
          <router-view />
        </slot>
      </div>
    </main>
  
    <div class="footer">
      <slot name="footer" />
    </div>
  </template>
  
  <script setup>
  import HomeNavbarComponent from "@/components/guest/home/HomeNavbarComponent.vue";
  </script>
  
  <style scoped>
  .main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .content {
    width: 100%;
  }
  
  .footer {
    width: 100%;
  }
  </style>