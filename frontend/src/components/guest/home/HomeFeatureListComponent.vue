<template>
  <section class="feature-list-section">
    <h2 class="feature-list-title">Erişilebilir Eğitim İçin Tüm Araçlar</h2>
    <div class="feature-list-grid">
      <ul>
        <li v-for="item in leftList" :key="item">{{ item }}</li>
      </ul>
      <ul>
        <li v-for="item in rightList" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeFeatureListComponent",
  data() {
    return {
      leftList: [
        'Sesli ders içerikleri',
        'Klavye ile tam gezinme',
        'Yüksek kontrast modu',
        'Büyük yazı seçeneği',
        'Erişilebilir sınavlar',
        'Topluluk desteği',
        'Uzman eğitmenler',
        'Bağımsız öğrenme',
      ],
      rightList: [
        'Mobil uyumlu platform',
        'Hızlı teknik destek',
        'Kapsayıcı içerikler',
        'Görsel ve işitsel materyaller',
        'Kişiselleştirilebilir ayarlar',
        'Güvenli ve gizli',
        'Kolay kayıt',
        'Daha fazlası',
      ]
    }
  }
}
</script>

<style scoped>
.feature-list-section {
  width: 100vw;
  background: #f8f7fa;
  padding: 64px 0 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feature-list-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 36px;
  text-align: center;
  max-width: 700px;
}
.feature-list-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  width: 100%;
  max-width: 900px;
}
.feature-list-grid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.feature-list-grid li {
  font-size: 1.08rem;
  color: #333;
  margin-bottom: 14px;
  padding-left: 18px;
  position: relative;
}
.feature-list-grid li:before {
  content: '✔';
  color: #197D81;
  position: absolute;
  left: 0;
  font-size: 1rem;
}
@media (max-width: 700px) {
  .feature-list-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style> 