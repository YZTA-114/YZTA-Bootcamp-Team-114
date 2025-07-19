<template>
  <div class="login-form">
    <div class="login-form__icon" aria-hidden="true">
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#bbb" stroke-width="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#bbb" stroke-width="2"/></svg>
    </div>
    <h1 id="login-title" class="login-form__title">Giriş Yap</h1>
    <form class="login-form__fields" aria-labelledby="login-title">
      <label for="login-email" class="login-form__label">E-posta</label>
      <input id="login-email" type="email" placeholder="E-posta" class="login-form__input" aria-required="true" aria-label="E-posta" />
      <div class="login-form__input-group">
        <label for="login-password" class="visually-hidden">Şifre</label>
        <input id="login-password" type="password" placeholder="Şifre" class="login-form__input" aria-required="true" aria-label="Şifre" />
        <button type="button" class="login-form__showpass" tabindex="-1" aria-label="Şifreyi göster">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#bbb" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="#bbb" stroke-width="2"/></svg>
        </button>
      </div>
      <div class="login-form__forgot">
        <router-link :to="{ name: 'forgot-password' }" aria-label="Şifremi unuttum">Şifremi Unuttum?</router-link>
      </div>
      <button type="submit" class="login-form__submit" aria-label="Giriş yap">GİRİŞ YAP</button>
    </form>
    <div class="login-form__signup">
      Hesabın yok mu? <router-link :to="{ name: 'register-type-select' }" aria-label="Kayıt ol">Kayıt Ol</router-link>
    </div>
    <div class="login-form__divider">
      <span></span>veya<span></span>
    </div>
    <div class="login-form__socials">
      <button class="login-form__social login-form__social--google" aria-label="Google ile giriş yap">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" /> Google
      </button>
    </div>
    <!-- Hata mesajı örneği -->
    <div v-if="true" class="login-form__error" role="alert">
      <span class="login-form__error-icon">❗</span>
      <span class="login-form__error-text">E-posta veya şifre hatalı.</span>
    </div>
  </div>
</template>

<script setup>
// Sadece görsel amaçlı, fonksiyonellik yok
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.login-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-s;
}
.login-form__icon {
  margin-bottom: 0;
}
.login-form__title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  color: $black;
  margin-bottom: $space-s;
  margin-top: 0;
  font-family: $font-family-primary-regular;
}
.login-form__label {
  font-size: $font-size-s;
  color: $black;
  margin-bottom: $space-2xs;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
}
.login-form__fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.login-form__input {
  width: 100%;
  padding: $space-2xs $space-s;
  border: 1.5px solid $orange;
  border-radius: 0.5rem;
  font-size: $font-size-m;
  background: $white;
  color: $black;
  font-family: inherit;
  outline: none;
  transition: border 0.2s;
}
.login-form__input:focus {
  border: 2px solid $orange;
}
.login-form__input-group {
  position: relative;
  display: flex;
  align-items: center;
}
.login-form__showpass {
  background: none;
  border: none;
  position: absolute;
  right: $space-xs;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.login-form__forgot {
  width: 100%;
  text-align: right;
  font-size: $font-size-xs;
  margin-bottom: $space-3xs;
}
.login-form__forgot a {
  color: $orange;
  text-decoration: none;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
}
.login-form__submit {
  width: 100%;
  padding: $space-s 0;
  background: $orange;
  color: $white;
  border: none;
  border-radius: 0.5rem;
  font-size: $font-size-m;
  font-weight: $font-weight-bold;
  cursor: pointer;
  margin-top: $space-3xs;
  transition: background 0.2s;
}
.login-form__submit:hover {
  background: $yellow;
}
.login-form__signup {
  font-size: $font-size-s;
  color: $black;
  font-family: $font-family-primary-regular;
}
.login-form__signup a {
  color: $orange;
  text-decoration: none;
  font-weight: $font-weight-semi-bold;
}
.login-form__divider {
  width: 100%;
  display: flex;
  align-items: center;
  color: #bbb;
  font-size: $font-size-xs;
  gap: $space-2xs;
  margin: $space-xs 0 $space-3xs 0;
}
.login-form__divider span {
  flex: 1;
  height: 1px;
  background: #eee;
}
.login-form__socials {
  width: 100%;
  display: flex;
  gap: $space-xs;
  justify-content: center;
}
.login-form__social {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-2xs;
  justify-content: center;
  padding: $space-2xs 0;
  border: 1.5px solid $black;
  border-radius: 0.5rem;
  background: $white;
  color: $black;
  font-size: $font-size-m;
  font-weight: $font-weight-semi-bold;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.login-form__social img {
  width: 20px;
  height: 20px;
  filter: grayscale(1) contrast(2);
}
.login-form__error {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-2xs;
  background: #fff0f0;
  border: 1.5px solid #D32F2F;
  color: #D32F2F;
  border-radius: 0.5rem;
  padding: $space-2xs $space-s;
  margin-bottom: $space-xs;
  font-size: $font-size-m;
  font-weight: $font-weight-semi-bold;
}
.login-form__error-icon {
  font-size: 1.2rem;
}
.login-form__error-text {
  flex: 1;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style> 