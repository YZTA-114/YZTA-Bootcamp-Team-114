<template>
  <section class="creative-how-it-works">
    <div class="chiw-header">
      <span class="chiw-badge">FeelEd’de Yolculuğun Başlasın!</span>
      <h2 class="chiw-title">Erişilebilir Eğitime 3 Adımda Ulaş!</h2>
      <p class="chiw-desc">
        FeelEd, görme engelli bireyler için tasarlanmış erişilebilir ve kapsayıcı bir eğitim platformudur. Herkesin eşit ve bağımsız öğrenme hakkı için buradayız.
      </p>
    </div>
    <div class="chiw-steps">
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616494.png" alt="Kayıt ve Erişim" />
        </div>
        <h3 class="chiw-step-title">Kolayca Kayıt Ol, Erişimini Kişiselleştir</h3>
        <p class="chiw-step-desc">
          FeelEd’e hızlıca kaydol, erişilebilirlik tercihlerini belirle. Platformumuz ekran okuyucu ve klavye ile tam uyumlu, herkes için erişilebilir.
        </p>
        <span class="chiw-tip">İpucu: Kendi ihtiyaçlarına göre ayarları özelleştirebilirsin!</span>
      </div>
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Derslere Katıl" />
        </div>
        <h3 class="chiw-step-title">Derslere Katıl, Sesli İçeriklerle Öğren</h3>
        <p class="chiw-step-desc">
          Tüm dersler ve materyaller sesli anlatım ve yüksek kontrast desteğiyle sunulur. Kendi hızında, bağımsızca öğrenmenin keyfini çıkar.
        </p>
        <span class="chiw-tip">İpucu: Klavye kısayolları ile platformda kolayca gezinebilirsin!</span>
      </div>
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Topluluk ve Destek" />
        </div>
        <h3 class="chiw-step-title">Topluluğa Katıl, Destek Al ve Paylaş</h3>
        <p class="chiw-step-desc">
          Aktif topluluğumuzda sorularını sor, deneyimlerini paylaş ve destek al. FeelEd’de yalnız değilsin, birlikte daha güçlüyüz!
        </p>
        <span class="chiw-tip">İpucu: Topluluk forumunda her zaman destek bulabilirsin!</span>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.creative-how-it-works {
  width: 100vw;
  background: #faf6ff;
  padding: 64px 0 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: $font-family-primary-regular;
}
.chiw-header {
  text-align: center;
  margin-bottom: 48px;
  font-family: $font-family-primary-regular;
}
.chiw-badge {
  background: #fff;
  color: #a084e8;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 18px;
  padding: 8px 28px;
  margin-bottom: 18px;
  display: inline-block;
  box-shadow: 0 2px 8px 0 rgba(160,132,232,0.12);
  letter-spacing: 1px;
  font-family: $font-family-primary-regular;
}
.chiw-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 18px;
  text-shadow: 0 2px 8px rgba(160,132,232,0.08);
  font-family: $font-family-primary-regular;
}
.chiw-desc {
  font-size: 1.15rem;
  color: #444;
  max-width: 650px;
  margin: 0 auto;
  font-family: $font-family-primary-regular;
}
.chiw-steps {
  display: flex;
  flex-direction: row;
  gap: 36px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
  font-family: $font-family-primary-regular;
}
.chiw-step {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 32px 0 rgba(160, 132, 232, 0.08);
  padding: 36px 26px 32px 26px;
  min-width: 260px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 2px solid #faf6ff;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
  font-family: $font-family-primary-regular;
}
.chiw-step:hover {
  transform: translateY(-8px) scale(1.03) rotate(-1deg);
  box-shadow: 0 12px 40px 0 rgba(160, 132, 232, 0.18);
  background: #faf6ff;
}
.chiw-icon img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(160,132,232,0.10);
  margin-bottom: 18px;
}
.chiw-step-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: #a084e8;
  margin-bottom: 12px;
  font-family: $font-family-primary-regular;
}
.chiw-step-desc {
  font-size: 1.01rem;
  color: #444;
  margin-bottom: 14px;
  font-family: $font-family-primary-regular;
}
.chiw-tip {
  font-size: 0.97rem;
  color: #a084e8;
  font-style: italic;
  margin-top: 8px;
  background: #faf6ff;
  border-radius: 8px;
  padding: 4px 12px;
  display: inline-block;
  font-family: $font-family-primary-regular;
}
@media (max-width: 900px) {
  .chiw-steps {
    flex-direction: column;
    gap: 22px;
    align-items: center;
  }
  .chiw-step {
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }
}
</style> 