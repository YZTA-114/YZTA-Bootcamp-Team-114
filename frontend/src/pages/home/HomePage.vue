<template>
  <MainLayout>
    <template #content>
      <div id="home-page">
        <div id="home-page-hero" class="container">
          <div id="home-cta">
            <h1 class="title">Eğitime Herkesin</h1>
            <h1 class="title">Dokunabileceği Bir Dünya</h1>
            <p class="description">
              Eğitimdeki her şeyi, herkesin erişebileceği bir platformda
              deneyin.
            </p>
            <div class="cta-buttons">
              <SecondaryButton>Şimdi Başla</SecondaryButton>
            </div>
          </div>
          <div class="home-page-hero-cards">
            <div class="card">
              <span class="card-title">Eğitim</span>
              <span class="card-description">Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.</span>
            </div>
            <div class="card md">
              <span class="card-title">Eğitim</span>
              <span class="card-description">Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.</span>
            </div>
            <div class="card sm">
              <span class="card-title">Eğitim</span>
              <span class="card-description">Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.</span>
            </div>
            <div class="card md">
              <span class="card-title">Eğitim</span>
              <span class="card-description">Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.</span>
            </div>
            <div class="card">
              <span class="card-title">Eğitim</span>
              <span class="card-description">Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layout/main/MainLayout.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
</script>
