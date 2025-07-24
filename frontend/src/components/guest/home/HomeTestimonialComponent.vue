<template>
  <section class="testimonial-section">
    <h2 class="testimonial-title">FeelEd ile herkes için erişilebilir eğitim mümkün.</h2>
    <div class="testimonial-grid">
      <div class="testimonial-card" v-for="(item, i) in testimonials" :key="i">
        <img :src="item.img" :alt="item.name" class="testimonial-img" />
        <div class="testimonial-content">
          <h3 class="testimonial-name">{{ item.name }}</h3>
          <p class="testimonial-text">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeTestimonialComponent",
  data() {
    return {
      testimonials: [
        { img: require('@/assets/images/team-386673_1280.jpg'), name: 'Ayşe K.', text: 'FeelEd sayesinde görme engelli bireyler olarak eğitimde eşit ve bağımsız bir şekilde ilerleyebiliyorum.' },
        { img: require('@/assets/images/nk-ni-wgS7Iz0Chtg-unsplash.jpg'), name: 'Mehmet B.', text: 'Sesli anlatımlar ve erişilebilir arayüz sayesinde dersleri rahatça takip edebiliyorum.' },
        { img: require('@/assets/images/maxim-tolchinskiy-iwAEyJPr8mo-unsplash.jpg'), name: 'Zeynep T.', text: 'FeelEd topluluğu sayesinde yalnız hissetmiyorum, her zaman destek bulabiliyorum.' },
        { img: require('@/assets/images/team-386673_1920.jpg'), name: 'Ali V.', text: 'Klavye ile kolayca gezinebiliyorum, tüm içerikler erişilebilir ve anlaşılır.' },
      ]
    }
  }
}
</script>

<style scoped>
.testimonial-section {
  width: 100vw;
  background: #fff;
  padding: 64px 0 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.testimonial-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 36px;
  text-align: center;
  max-width: 700px;
}
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1100px;
}
.testimonial-card {
  background: #f8f7fa;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
  padding: 32px 18px 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
}
.testimonial-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}
.testimonial-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #222;
}
.testimonial-text {
  font-size: 1rem;
  color: #444;
}
@media (max-width: 900px) {
  .testimonial-grid {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
}
@media (max-width: 600px) {
  .testimonial-grid {
    grid-template-columns: 1fr;
  }
  .testimonial-section {
    padding: 32px 0 16px 0;
  }
}
</style> 