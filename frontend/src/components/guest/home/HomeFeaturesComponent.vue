<template>
  <section class="home-features-section">
    <div class="features-wrapper">
      <div class="features-left">
        <div class="features-circles-bg">
          <div v-for="n in 9" :key="n" class="circle"></div>
        </div>
        <h2 class="features-title">Erişilebilir Özellikler<span class="dot">.</span></h2>
        <p class="features-desc">
          Onlearn, görme engelli bireyler için erişilebilir ve kapsayıcı bir eğitim platformudur. Herkes için eşit ve bağımsız öğrenme deneyimi sunar.
        </p>
        <button class="features-btn">Daha Fazla Bilgi</button>
      </div>
      <div class="features-right">
        <div class="features-grid">
          <div class="feature-card main">
            <div class="feature-dot"></div>
            <div>
              <h3>Sesli Anlatım</h3>
              <p>Tüm ders içerikleri ve materyaller sesli olarak sunulur.</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-dot"></div>
            <div>
              <h3>Klavye ile Gezinme</h3>
              <p>Platformda tüm işlemler klavye ile kolayca yapılabilir.</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-dot"></div>
            <div>
              <h3>Yüksek Kontrast</h3>
              <p>Görsel içerikler yüksek kontrast ile sunulur, göz yormaz.</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-dot"></div>
            <div>
              <h3>Topluluk Desteği</h3>
              <p>Her zaman destek alabileceğiniz aktif bir topluluk.</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-dot"></div>
            <div>
              <h3>Yüksek Kontrast</h3>
              <p>Görsel içerikler yüksek kontrast ile sunulur, göz yormaz.</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-dot"></div>
            <div>
              <h3>Topluluk Desteği</h3>
              <p>Her zaman destek alabileceğiniz aktif bir topluluk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeFeaturesComponent",
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.home-features-section {
  padding-bottom: $space-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $black;
  width: 100%;
  font-family: $font-family-primary-regular;
}
.features-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
  padding: 48px 32px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  gap: 48px;
  background: #fff;
  font-family: $font-family-primary-regular;
}
.features-left {
  flex: 1;
  position: relative;
  min-width: 260px;
  max-width: 340px;
  font-family: $font-family-primary-regular;
}
.features-circles-bg {
  position: absolute;
  top: -24px;
  left: -24px;
  display: grid;
  grid-template-columns: repeat(3, 28px);
  grid-gap: 8px;
  opacity: 0.18;
  z-index: 0;
}
.circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $black;
}
.features-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  color: #222;
  font-family: $font-family-primary-regular;
}
.dot {
  color: #a084e8;
}
.features-desc {
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 28px;
  z-index: 1;
  position: relative;
  font-family: $font-family-primary-regular;
}
.features-btn {
  background: linear-gradient(90deg, #a084e8 60%, #8f6be8 100%);
  color: #fff;
  border: none;
  border-radius: 22px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(160, 132, 232, 0.18);
  cursor: pointer;
  transition: background 0.2s;
  z-index: 1;
  position: relative;
  font-family: $font-family-primary-regular;
}

.features-right {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family-primary-regular;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 28px;
  font-family: $font-family-primary-regular;
}
.feature-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
  padding: 28px 22px 22px 22px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 210px;
  min-height: 120px;
  transition: box-shadow 0.2s, transform 0.2s;
  font-family: $font-family-primary-regular;
}
.feature-card.main {
  background: linear-gradient(120deg, $orange 70%, $orange 100%);
  color: #fff;
  box-shadow: 0 8px 32px 0 rgba(160, 132, 232, 0.18);
  transform: translateY(-18px);
  font-family: $font-family-primary-regular;
}
.feature-card.main h3,
.feature-card.main p {
  color: #fff;
  font-family: $font-family-primary-regular;
}
.feature-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a084e8;
}
.feature-card.main .feature-dot {
  background: #fff;
  border: 2px solid #a084e8;
}
.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  font-family: $font-family-primary-regular;
}
.feature-card p {
  font-size: 0.98rem;
  color: #444;
  margin: 0;
  font-family: $font-family-primary-regular;
}
@media (max-width: 900px) {
  .features-wrapper {
    flex-direction: column;
    padding: 32px 8px;
    gap: 32px;
  }
  .features-left {
    max-width: 100%;
    min-width: 0;
  }
  .features-right {
    width: 100%;
  }
  .features-grid {
    gap: 18px;
  }
}
@media (max-width: 600px) {
  .home-features-section {
    min-height: 100vh;
    padding: 0;
  }
  .features-wrapper {
    padding: 18px 2px;
    border-radius: 8px;
  }
  .features-title {
    font-size: 2rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .feature-card {
    min-width: 0;
    padding: 18px 10px 14px 10px;
  }
}
</style> 