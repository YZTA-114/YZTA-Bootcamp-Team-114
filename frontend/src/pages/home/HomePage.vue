<template>
  <MainLayout>
    <template #content>
      <div id="home-page">
        <section id="home-hero" class="full-section hero-section">
          <div id="home-page-hero-content">
            <div id="home-cta">
              <h1 class="title">Eğitime Herkesin</h1>
              <h1 class="title">Dokunabileceği Bir Dünya</h1>
              <p class="description">
                Eğitimdeki her şeyi, herkesin erişebileceği bir platformda deneyin.
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
        </section>
        <HomeHowItWorksComponent />
        <section id="home-features" class="content-section">
          <HomeFeaturesComponent />
        </section>
        <HomeTestimonialComponent />
        <HomeBigCtaComponent />
        <HomeFooterComponent />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layout/main/MainLayout.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";
import HomeFeaturesComponent from "@/components/guest/home/HomeFeaturesComponent.vue";
import HomeHowItWorksComponent from "@/components/guest/home/HomeHowItWorksComponent.vue";
import HomeFooterComponent from "@/components/guest/home/HomeFooterComponent.vue";
import HomeTestimonialComponent from "@/components/guest/home/HomeTestimonialComponent.vue";
import HomeBigCtaComponent from "@/components/guest/home/HomeBigCtaComponent.vue";
</script>

<style scoped>
#home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.full-section {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  box-sizing: border-box;
  padding: 0;
}
.content-section {
  width: 100vw;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  box-sizing: border-box;
  padding: 0;
}
.hero-section {
  background: #000;
  color: #fff;
}
#home-page-hero-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 24px 0 24px;
  box-sizing: border-box;
}
</style>
