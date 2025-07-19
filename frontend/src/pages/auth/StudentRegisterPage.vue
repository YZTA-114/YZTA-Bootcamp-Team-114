<template>
  <LoginLayout>
    <template #right>
      <div class="register-form">
        <h1 class="register-form__title">Öğrenci Kaydı</h1>
        
        <!-- Progress Bar -->
        <div class="register-form__progress">
          <div class="register-form__progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span class="register-form__progress-number">1</span>
            <span class="register-form__progress-text">Kişisel Bilgiler</span>
          </div>
          <div class="register-form__progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span class="register-form__progress-number">2</span>
            <span class="register-form__progress-text">Eğitim Bilgileri</span>
          </div>
          <div class="register-form__progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <span class="register-form__progress-number">3</span>
            <span class="register-form__progress-text">Hesap Bilgileri</span>
          </div>
        </div>

        <!-- Step 1: Kişisel Bilgiler -->
        <form v-if="currentStep === 1" class="register-form__fields" @submit.prevent="nextStep">
          <label for="student-name" class="register-form__label">Ad</label>
          <input id="student-name" v-model="formData.name" type="text" placeholder="Ad" class="register-form__input" required />
          <label for="student-surname" class="register-form__label">Soyad</label>
          <input id="student-surname" v-model="formData.surname" type="text" placeholder="Soyad" class="register-form__input" required />
          <label for="student-tc" class="register-form__label">TC Kimlik Numarası</label>
          <input id="student-tc" v-model="formData.tc" type="text" placeholder="TC Kimlik Numarası" class="register-form__input" maxlength="11" required />
          <button type="submit" class="register-form__submit">Devam Et</button>
        </form>

        <!-- Step 2: Eğitim Bilgileri -->
        <form v-if="currentStep === 2" class="register-form__fields" @submit.prevent="nextStep">
          <label for="student-level" class="register-form__label">Eğitim Seviyesi</label>
          <select id="student-level" v-model="formData.level" class="register-form__input" required>
            <option value="">Eğitim seviyesi seçiniz</option>
            <option value="ortaokul">Ortaokul</option>
            <option value="lise">Lise</option>
            <option value="universite">Üniversite</option>
          </select>
          <label for="student-class" class="register-form__label">Sınıf Bilgisi</label>
          <input id="student-class" v-model="formData.class" type="text" placeholder="Sınıf Bilgisi" class="register-form__input" required />
          <div class="register-form__buttons">
            <button type="button" class="register-form__back-btn" @click="prevStep">Geri</button>
            <button type="submit" class="register-form__submit">Devam Et</button>
          </div>
        </form>

        <!-- Step 3: Hesap Bilgileri -->
        <form v-if="currentStep === 3" class="register-form__fields" @submit.prevent="submitForm">
          <label for="student-email" class="register-form__label">E-posta</label>
          <input id="student-email" v-model="formData.email" type="email" placeholder="E-posta" class="register-form__input" required />
          <label for="student-password" class="register-form__label">Şifre</label>
          <input id="student-password" v-model="formData.password" type="password" placeholder="Şifre" class="register-form__input" required />
          <label for="student-password-confirm" class="register-form__label">Şifre Tekrar</label>
          <input id="student-password-confirm" v-model="formData.passwordConfirm" type="password" placeholder="Şifre Tekrar" class="register-form__input" required />
          <div class="register-form__buttons">
            <button type="button" class="register-form__back-btn" @click="prevStep">Geri</button>
            <button type="submit" class="register-form__submit">Kaydı Tamamla</button>
          </div>
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
import { ref, reactive } from 'vue';

const currentStep = ref(1);
const formData = reactive({
  name: '',
  surname: '',
  tc: '',
  level: '',
  class: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitForm = () => {
  // Form gönderme işlemi burada yapılacak
  console.log('Form data:', formData);
};
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
.register-form__progress {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: $space-s;
}
.register-form__progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3xs;
  flex: 1;
  position: relative;
}
.register-form__progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}
.register-form__progress-step.completed:not(:last-child)::after {
  background: $orange;
}
.register-form__progress-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  z-index: 2;
  position: relative;
}
.register-form__progress-step.active .register-form__progress-number,
.register-form__progress-step.completed .register-form__progress-number {
  background: $orange;
}
.register-form__progress-text {
  font-size: $font-size-xs;
  color: $black;
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
.register-form__buttons {
  display: flex;
  gap: $space-xs;
  margin-top: $space-xs;
}
.register-form__back-btn {
  flex: 1;
  padding: $space-s 0;
  background: transparent;
  color: $orange;
  border: 1.5px solid $orange;
  border-radius: 0.5rem;
  font-size: $font-size-m;
  font-weight: $font-weight-bold;
  cursor: pointer;
  transition: all 0.2s;
}
.register-form__back-btn:hover {
  background: $orange;
  color: $white;
}
.register-form__submit {
  flex: 1;
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