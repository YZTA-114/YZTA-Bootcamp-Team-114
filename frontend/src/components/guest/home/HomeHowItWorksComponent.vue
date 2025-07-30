<template>
  <section class="creative-how-it-works">
    <div class="chiw-header">
      <span class="chiw-badge">FeelEd'de Yolculuğun Başlasın!</span>
      <h2 class="chiw-title">Erişilebilir Eğitime 3 Adımda Ulaş!</h2>
      <p class="chiw-desc">
        FeelEd, görme engelli bireyler için tasarlanmış erişilebilir ve kapsayıcı bir eğitim platformudur. Herkesin eşit ve bağımsız öğrenme hakkı için buradayız.
      </p>
    </div>
    <div class="chiw-steps">
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828471.png" alt="Kayıt ve Erişim" />
        </div>
        <h3 class="chiw-step-title">Kolayca Kayıt Ol, Erişimini Kişiselleştir</h3>
        <p class="chiw-step-desc">
          FeelEd'e hızlıca kaydol, erişilebilirlik tercihlerini belirle. Platformumuz ekran okuyucu ve klavye ile tam uyumlu, herkes için erişilebilir.
        </p>
        <span class="chiw-tip">İpucu: Kendi ihtiyaçlarına göre ayarları özelleştirebilirsin!</span>
      </div>
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="AI Sesli Asistan" />
        </div>
        <h3 class="chiw-step-title">AI Destekli Sesli Öğrenme Deneyimi</h3>
        <p class="chiw-step-desc">
          Yapay zeka destekli sesli asistan ile dersleri dinle, sorularını sor ve anlamadığın konuları tekrar et. AI senin öğrenme hızına göre içerik sunar.
        </p>
        <span class="chiw-tip">İpucu: AI asistanına sesli sorular sorabilir ve anında yanıt alabilirsin!</span>
      </div>
      <div class="chiw-step">
        <div class="chiw-icon" aria-hidden="true">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Topluluk ve Destek" />
        </div>
        <h3 class="chiw-step-title">Topluluğa Katıl, Destek Al ve Paylaş</h3>
        <p class="chiw-step-desc">
          Aktif topluluğumuzda sorularını sor, deneyimlerini paylaş ve destek al. FeelEd'de yalnız değilsin, birlikte daha güçlüyüz!
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
  background: $black;
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
  background: $white;
  color: $black;
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
  color: $white;
  margin-bottom: 18px;
  text-shadow: 0 2px 8px rgba(160,132,232,0.08);
  font-family: $font-family-primary-regular;
}
.chiw-desc {
  font-size: 1.15rem;
  color: $white;
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
  background: $orange;
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
  color: $black;
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
  color: $black;
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