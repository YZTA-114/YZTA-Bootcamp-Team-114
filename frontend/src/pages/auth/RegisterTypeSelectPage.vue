<template>
  <LoginLayout>
    <template #right>
      <div class="register-type-select">
        <h1 class="register-type-select__title">Kayıt Türünü Seç</h1>
        <div class="register-type-select__buttons">
          <PrimaryButton class="register-type-select__button" @click="goStudent">Öğrenci olarak kayıt ol</PrimaryButton>
          <PrimaryButton class="register-type-select__button" @click="goTeacher" secondary>Öğretmen olarak kayıt ol</PrimaryButton>
        </div>
        <div class="register-type-select__login-link">
          Zaten hesabın var mı? <router-link :to="{ name: 'login' }">Giriş Yap</router-link>
        </div>
      </div>
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
import PrimaryButton from '@/components/custom/button/PrimaryButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goStudent = () => router.push({ name: 'register-student' });
const goTeacher = () => router.push({ name: 'register-teacher' });
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';
.register-type-select {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-l;
  border: 1.5px solid $orange;
  border-radius: 0.5rem;
  padding: $space-l;
}
.register-type-select__title {
  font-size: $font-size-l;
  font-weight: $font-weight-bold;
  color: $black;
  margin-bottom: $space-s;
  text-align: center;
  font-family: $font-family-primary-regular;
}
.register-type-select__buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-s;
}
.register-type-select__button {
  width: 100%;
  font-size: $font-size-m;
  padding: $space-s 0;
}
.register-type-select__login-link {
  font-size: $font-size-s;
  color: $black;
  margin-top: $space-m;
  font-family: $font-family-primary-regular;
}
.register-type-select__login-link a {
  color: $orange;
  text-decoration: none;
  font-weight: $font-weight-semi-bold;
}
</style> 