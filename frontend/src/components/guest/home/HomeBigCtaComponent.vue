<template>
  <section class="big-cta-section">
    <div class="big-cta-box">
      <h2>Eğitim Herkes İçin Erişilebilir!</h2>
      <p>Onlearn ile engelsiz ve bağımsız öğrenmeye hemen başla.</p>
      <button class="big-cta-btn">Hemen Başla</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeBigCtaComponent",
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.big-cta-section {
  width: 100vw;
  background: $black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0 64px 0;
}
.big-cta-box {
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
  padding: 48px 32px;
  max-width: 600px;
  width: 100%;
  text-align: center;
}
.big-cta-box h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
}
.big-cta-box p {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 28px;
}
.big-cta-btn {
  background: #197D81;
  color: #fff;
  border: none;
  border-radius: 22px;
  padding: 12px 36px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.big-cta-btn:hover {
  background: #0a2a2a;
}
</style> 