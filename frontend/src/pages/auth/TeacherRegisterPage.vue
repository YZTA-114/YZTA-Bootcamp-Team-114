<template>
  <LoginLayout>
    <template #right>
      <div class="register-form">
        <h1 class="register-form__title">Öğretmen Kaydı</h1>
        <form class="register-form__fields">
          <label for="teacher-name" class="register-form__label">Ad Soyad</label>
          <input id="teacher-name" type="text" placeholder="Ad Soyad" class="register-form__input" />
          <label for="teacher-email" class="register-form__label">E-posta</label>
          <input id="teacher-email" type="email" placeholder="E-posta" class="register-form__input" />
          <label for="teacher-password" class="register-form__label">Şifre</label>
          <input id="teacher-password" type="password" placeholder="Şifre" class="register-form__input" />
          <label for="teacher-branch" class="register-form__label">Branş</label>
          <input id="teacher-branch" type="text" placeholder="Branş" class="register-form__input" />
          <button type="submit" class="register-form__submit">Kaydı Tamamla</button>
        </form>
        <div class="register-form__login-link">
          Zaten hesabın var mı? <router-link :to="{ name: 'login' }">Giriş Yap</router-link>
        </div>
      </div>
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.register-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-s;
}
.register-form__title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  color: $black;
  margin-bottom: $space-s;
  text-align: center;
  font-family: $font-family-primary-regular;
}
.register-form__label {
  font-size: $font-size-s;
  color: $black;
  margin-bottom: $space-2xs;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
}
.register-form__fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.register-form__input {
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
.register-form__input:focus {
  border: 2px solid $orange;
}
.register-form__submit {
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
.register-form__submit:hover {
  background: $yellow;
}
.register-form__login-link {
  font-size: $font-size-s;
  color: $black;
  margin-top: $space-m;
  font-family: $font-family-primary-regular;
}
.register-form__login-link a {
  color: $orange;
  text-decoration: none;
  font-weight: $font-weight-semi-bold;
}
</style> 