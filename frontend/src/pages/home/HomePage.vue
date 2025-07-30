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
                <div class="card-image">
                  <img src="@/assets/images/content-3326-26b4d60c-56cd-4afa-b00b-bfbdd9571995_640x480.jpg" alt="Louis Braille" />
                </div>
                <span class="card-title">Louis Braille</span>
                <span class="card-description">Braille Alfabesinin mucidi, tüm dünyada görme engellilerin bilgiye erişimini sağladı.</span>
              </div>
              <div class="card md">
                <div class="card-image">
                  <img src="@/assets/images/karanligin-en-renkli-hali-helen-keller.jpg" alt="Helen Keller" />
                </div>
                <span class="card-title">Helen Keller</span>
                <span class="card-description">İlk görme ve işitme engelli üniversite mezunu, 12 kitap yazarı ve aktivist.</span>
              </div>
              <div class="card sm">
                <div class="card-image">
                  <img src="@/assets/images/640px-Stevie_Wonder_1973.jpeg" alt="Stevie Wonder" />
                </div>
                <span class="card-title">Stevie Wonder</span>
                <span class="card-description">25 Grammy Ödülü kazanan müzik efsanesi ve teknoloji destekçisi.</span>
              </div>
              <div class="card md">
                <div class="card-image">
                  <img src="@/assets/images/IMG_472707-7E13F6-057FBD-3938DE-A9E960-68D427.jpg" alt="Cemil Meriç" />
                </div>
                <span class="card-title">Cemil Meriç</span>
                <span class="card-description">Türk edebiyatında derin izler bırakan yazar ve düşünür.</span>
              </div>
              <div class="card">
                <div class="card-image">
                  <img src="@/assets/images/12295,133jpg.png" alt="Aşık Veysel" />
                </div>
                <span class="card-title">Aşık Veysel</span>
                <span class="card-description">Türk halk müziğinin efsanevi ozanı, görme engelli olmasına rağmen büyük eserler verdi.</span>
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
