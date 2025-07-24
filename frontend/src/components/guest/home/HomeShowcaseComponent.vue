<template>
  <section class="showcase-section">
    <h2 class="showcase-title">Designs that turn heads and close sales.</h2>
    <div class="showcase-grid">
      <div class="showcase-card" v-for="(item, i) in showcases" :key="i">
        <img :src="item.img" :alt="item.title" class="showcase-img" />
        <div class="showcase-caption">{{ item.title }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeShowcaseComponent",
  data() {
    return {
      showcases: [
        { img: require('@/assets/images/team-386673_1280.jpg'), title: 'Online Eğitim' },
        { img: require('@/assets/images/team-386673_1920.jpg'), title: 'Dijital Sınıf' },
        { img: require('@/assets/images/maxim-tolchinskiy-iwAEyJPr8mo-unsplash.jpg'), title: 'Etkileşimli İçerik' },
        { img: require('@/assets/images/nk-ni-wgS7Iz0Chtg-unsplash.jpg'), title: 'Kariyer Gelişimi' },
        { img: require('@/assets/images/logo.png'), title: 'Marka Gücü' },
        { img: require('@/assets/images/a_dark-themed_modern_and_professional_background_smooth_gradient_transitions_in_deep_navy_and_charc_4a.png'), title: 'Modern Tasarım' },
        { img: require('@/assets/images/team-386673_1280.jpg'), title: 'Topluluk' },
        { img: require('@/assets/images/team-386673_1920.jpg'), title: 'Başarı Hikayeleri' },
      ]
    }
  }
}
</script>

<style scoped>
.showcase-section {
  width: 100vw;
  background: #eaf3fa;
  padding: 64px 0 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.showcase-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 36px;
  text-align: center;
  max-width: 700px;
}
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1100px;
}
.showcase-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.showcase-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
.showcase-caption {
  padding: 12px 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  text-align: center;
}
@media (max-width: 900px) {
  .showcase-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}
@media (max-width: 600px) {
  .showcase-grid {
    grid-template-columns: 1fr;
  }
  .showcase-section {
    padding: 32px 0 16px 0;
  }
}
</style> 