<template>
  <LoginLayout>
    <template #right>
      <div class="forgot-password-form">
        <div class="forgot-password-form__icon" aria-hidden="true">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#E3F2FD"/><path d="M12 17v.01M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h1 id="forgot-password-title" class="forgot-password-form__title">Şifreni mi unuttun?</h1>
        <div class="forgot-password-form__desc" id="forgot-password-desc">Şifreni sıfırlamak için e-posta adresine bir kod gönderilecek</div>
        <form class="forgot-password-form__fields" aria-labelledby="forgot-password-title" aria-describedby="forgot-password-desc">
          <label class="forgot-password-form__label" for="forgot-email">E-posta Adresi</label>
          <input id="forgot-email" type="email" placeholder="E-posta adresinizi girin" class="forgot-password-form__input" aria-required="true" aria-label="E-posta adresi" />
          <button type="submit" class="forgot-password-form__submit" aria-label="Şifreyi sıfırla">Şifreyi Sıfırla</button>
        </form>
        <div class="forgot-password-form__back">
          <router-link :to="{ name: 'login' }" aria-label="Giriş sayfasına dön">&larr; Giriş sayfasına dön</router-link>
        </div>
        <!-- Hata mesajı örneği, gerçek hata olursa gösterilmeli -->
        <!-- <div role="alert" class="forgot-password-form__error">Hatalı e-posta adresi girdiniz.</div> -->
      </div>
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.forgot-password-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-s;
}
.forgot-password-form__icon {
  margin-bottom: $space-3xs;
}
.forgot-password-form__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $black;
  margin-bottom: $space-3xs;
  text-align: center;
  font-family: $font-family-primary-medium;
}
.forgot-password-form__desc {
  color: $black;
  font-size: $font-size-s;
  text-align: center;
  margin-bottom: $space-xs;
  font-family: $font-family-primary-regular;
}
.forgot-password-form__fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.forgot-password-form__label {
  font-size: $font-size-xs;
  color: $black;
  margin-bottom: $space-3xs;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
}
.forgot-password-form__input {
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
.forgot-password-form__input:focus {
  border: 2px solid $orange;
}
.forgot-password-form__submit {
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
.forgot-password-form__submit:hover {
  background: $yellow;
}
.forgot-password-form__back {
  font-size: $font-size-m;
  color: $black;
  margin-top: $space-m;
  text-align: center;
  font-family: $font-family-primary-regular;
}
.forgot-password-form__back a {
  color: $orange;
  text-decoration: none;
  font-weight: $font-weight-semi-bold;
}
</style> 