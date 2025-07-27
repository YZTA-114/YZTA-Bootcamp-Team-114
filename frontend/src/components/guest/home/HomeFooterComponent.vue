<template>
  <footer class="footer-section">
    <div class="footer-bg-shape"></div>
    <div class="footer-content">
      <div class="footer-col footer-brand">
        <div class="footer-logo-row">
          <span class="footer-logo-text">FeelEd</span>
        </div>
        <div class="footer-info">
          <div class="footer-info-row"><span class="footer-icon">📍</span><span><b>Address:</b><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</span></div>
          <div class="footer-info-row"><span class="footer-icon">📞</span><span><b>Tel:</b> +9229341037</span></div>
          <div class="footer-info-row"><span class="footer-icon">⏰</span><span><b>Response hours:</b> 8 to 20</span></div>
          <div class="footer-info-row"><span class="footer-icon">✉️</span><span><b>Email:</b> info@onlearn.com</span></div>
        </div>
      </div>
      <div class="footer-col footer-links">
        <div class="footer-links-group">
          <span class="footer-links-title">Categories</span>
          <ul>
            <li><a href="#">Counseling</a></li>
            <li><a href="#">Health and fitness</a></li>
            <li><a href="#">Individual development</a></li>
            <li><a href="#">more</a></li>
          </ul>
        </div>
        <div class="footer-links-group">
          <span class="footer-links-title">Links</span>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">blog</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-col footer-subscribe">
        <form class="footer-form">
          <input type="email" placeholder="Email..." class="footer-input" />
          <button type="submit" class="footer-btn">send</button>
        </form>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "HomeFooterComponent",
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.footer-section {
  position: relative;
  width: 100vw;
  background: $black;
  padding: 64px 0 48px 0;
  overflow: hidden;
  font-family: $font-family-primary-regular;
}
.footer-bg-shape {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 100px;
  background: $black;
  border-top-left-radius: 80px 16px;
  border-top-right-radius: 80px 16px;
  z-index: 0;
}
.footer-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  font-family: $font-family-primary-regular;
}
.footer-col {
  flex: 1 1 220px;
  min-width: 200px;
  margin-bottom: 24px;
  font-family: $font-family-primary-regular;
}
.footer-brand {
  max-width: 320px;
}
.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.footer-logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
}
.footer-logo-text {
  font-size: 2rem;
  font-weight: 700;
  color: $orange;
  letter-spacing: 1px;
  font-family: $font-family-primary-regular;
}
.footer-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: $font-family-primary-regular;
}
.footer-info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 1rem;
  color: $white;
  font-family: $font-family-primary-regular;
}
.footer-icon {
  font-size: 1.2rem;
  margin-top: 2px;
}
.footer-links {
  display: flex;
  gap: 48px;
  justify-content: center;
  font-family: $font-family-primary-regular;
}
.footer-links-group {
  min-width: 120px;
  font-family: $font-family-primary-regular;
}
.footer-links-title {
  font-weight: 700;
  color: $orange;
  margin-bottom: 8px;
  display: block;
  font-family: $font-family-primary-regular;
}
.footer-links-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: $font-family-primary-regular;
}
.footer-links-group li {
  margin-bottom: 6px;
  font-family: $font-family-primary-regular;
}
.footer-links-group a {
  color: $white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  font-family: $font-family-primary-regular;
}
.footer-links-group a:hover {
  color: $orange;
}
.footer-subscribe {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: $font-family-primary-regular;
}
.footer-form {
  display: flex;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(234, 128, 20, 0.08);
  font-family: $font-family-primary-regular;
}
.footer-input {
  border: none;
  outline: none;
  padding: 12px 18px;
  font-size: 1rem;
  border-radius: 22px 0 0 22px;
  min-width: 180px;
  font-family: $font-family-primary-regular;
}
.footer-btn {
  background: $orange;
  color: #fff;
  border: none;
  border-radius: 0 22px 22px 0;
  padding: 0 28px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-family: $font-family-primary-regular;
}
.footer-btn:hover {
  background: #d2691e;
}
@media (max-width: 900px) {
  .footer-content {
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
  }
  .footer-links {
    justify-content: flex-start;
    gap: 24px;
  }
  .footer-subscribe {
    justify-content: flex-start;
  }
}
@media (max-width: 600px) {
  .footer-section {
    padding: 32px 0 24px 0;
  }
  .footer-content {
    padding: 0 8px;
  }
  .footer-logo-text {
    font-size: 1.3rem;
  }
  .footer-form {
    flex-direction: column;
    border-radius: 12px;
    box-shadow: none;
  }
  .footer-input, .footer-btn {
    border-radius: 0;
    width: 100%;
    min-width: 0;
    padding: 10px 8px;
    font-size: 0.98rem;
  }
  .footer-btn {
    border-radius: 0 0 12px 12px;
    margin-top: 2px;
  }
}
</style>