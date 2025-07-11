<template>
  <div id="primary-navigation">
    <router-link id="logo" :to="{ name: 'home' }">
      <img src="../../../assets/images/logo.png" alt="Logo" />
    </router-link>
    <nav aria-labelledby="primary-navigation" id="nav-menu">
      <div id="links">
        <router-link :to="{ name: 'home' }" class="nav-link"
          >Ana Sayfa</router-link
        >
        <router-link :to="{ name: 'home' }" class="nav-link"
          >Hakkımızda</router-link
        >
        <router-link :to="{ name: 'home' }" class="nav-link"
          >İletişim</router-link
        >
      </div>
    </nav>
    <router-link :to="{ name: 'login' }">
      <PrimaryButton>Giriş Yap</PrimaryButton>
    </router-link>
  </div>
</template>

<script setup>
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
</script>
