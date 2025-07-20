<template>
  <div class="register-form">
    <div class="register-form__header">
      <h1 class="register-form__title">Hesabını Oluştur</h1>
      <p class="register-form__subtitle">Bize katıl, yolculuğuna bugün başla.</p>
    </div>

    <div class="register-form__progress">
      <div class="register-form__progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <span class="register-form__progress-number">1</span>
        <span class="register-form__progress-text">Kişisel Bilgiler</span>
      </div>
      <div class="register-form__progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <span class="register-form__progress-number">2</span>
        <span class="register-form__progress-text">Ek Bilgiler</span>
      </div>
      <div class="register-form__progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
        <span class="register-form__progress-number">3</span>
        <span class="register-form__progress-text">Hesap Bilgileri</span>
      </div>
    </div>

    <!-- Step 1: Kişisel Bilgiler -->
    <form v-if="currentStep === 1" class="register-form__form" @submit.prevent="nextStep">
      <FormInput
        v-model="form.firstName"
        type="text"
        label="Ad"
        placeholder="Adınızı girin"
        id="register-first-name"
        required
      />
      <FormInput
        v-model="form.lastName"
        type="text"
        label="Soyad"
        placeholder="Soyadınızı girin"
        id="register-last-name"
        required
      />
      <button type="submit" class="register-form__submit">Devam Et</button>
    </form>

    <!-- Step 2: Ek Bilgiler (Öğrenci/Öğretmen) -->
    <form v-if="currentStep === 2" class="register-form__form" @submit.prevent="nextStep">
      <template v-if="props.userType === 'student'">
        <FormInput
          v-model="form.tc"
          type="text"
          label="TC Kimlik Numarası"
          placeholder="TC Kimlik Numaranızı girin"
          id="register-tc"
          required
        />
        <FormInput
          v-model="form.level"
          type="text"
          label="Eğitim Seviyesi (Ortaokul/Lise/Üniversite)"
          placeholder="Eğitim seviyenizi girin"
          id="register-level"
          required
        />
        <FormInput
          v-model="form.class"
          type="text"
          label="Sınıf Bilgisi"
          placeholder="Sınıfınızı girin"
          id="register-class"
          required
        />
      </template>
      <template v-else>
        <FormInput
          v-model="form.branch"
          type="text"
          label="Branş"
          placeholder="Branşınızı girin"
          id="register-branch"
          required
        />
        <FormInput
          v-model="form.class"
          type="text"
          label="Sınıf Bilgisi"
          placeholder="Sınıf bilgisini girin"
          id="register-class"
          required
        />
        <FormInput
          v-model="form.school"
          type="text"
          label="Okul (İsteğe Bağlı)"
          placeholder="Çalıştığınız okulu girin"
          id="register-school"
        />
        <FormInput
          v-model="form.experience"
          type="text"
          label="Deneyim Yılı"
          placeholder="Deneyim yılınızı girin"
          id="register-experience"
          required
        />
      </template>
      <div class="register-form__buttons">
        <button type="button" class="register-form__back-btn" @click="prevStep">Geri</button>
        <button type="submit" class="register-form__submit">Devam Et</button>
      </div>
    </form>

    <!-- Step 3: Hesap Bilgileri -->
    <form v-if="currentStep === 3" class="register-form__form" @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        type="email"
        label="E-posta"
        placeholder="E-posta adresinizi girin"
        id="register-email"
        required
      />
      <FormInput
        v-model="form.password"
        type="password"
        label="Şifre"
        placeholder="Şifre oluşturun"
        id="register-password"
        required
      />
      <FormInput
        v-model="form.confirmPassword"
        type="password"
        label="Şifre Tekrar"
        placeholder="Şifrenizi tekrar girin"
        id="register-confirm-password"
        required
      />
      <div class="register-form__buttons">
        <button type="button" class="register-form__back-btn" @click="prevStep">Geri</button>
        <button type="submit" class="register-form__submit">Kaydı Tamamla</button>
      </div>
    </form>

    <div class="register-form__login">
      Zaten hesabın var mı? <router-link :to="{ name: 'login' }">Giriş Yap</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import FormInput from '@/components/custom/form/FormInput.vue'

const props = defineProps({
  userType: {
    type: String,
    default: 'student' // veya 'teacher'
  }
})

const currentStep = ref(1)
const form = ref({
  firstName: '',
  lastName: '',
  tc: '',
  level: '',
  class: '',
  branch: '',
  school: '',
  experience: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
const handleSubmit = () => {
  // Validasyon ve submit işlemleri burada
  console.log('Kayıt formu gönderildi:', form.value)
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.register-form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
  padding: $space-s;
}

.register-form__header {
  text-align: center;
  margin-bottom: $space-m;
}

.register-form__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $black;
  margin: 0 0 $space-xs 0;
  font-family: $font-family-primary-bold;
  line-height: 1.2;
}

.register-form__subtitle {
  font-size: $font-size-s;
  color: #666;
  margin: 0;
  font-family: $font-family-primary-regular;
  line-height: 1.5;
}

.register-form__progress {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: $space-s;
  position: relative;
  gap: 32px; // adımlar arası boşluk
}

.register-form__progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  min-width: 90px; // adım başlıkları için genişlik
  margin: 0 8px;
}

.register-form__progress-step::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -50%;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
  z-index: -1;
}

.register-form__progress-step:first-child::before {
  left: 50%;
}

.register-form__progress-step:last-child::before {
  right: 50%;
}

.register-form__progress-step.active {
  color: $black;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
}

.register-form__progress-step.active .register-form__progress-number {
  background: $black;
  color: $white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
}

.register-form__progress-step.completed .register-form__progress-number {
  background: $black;
  color: $white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
}

.register-form__progress-number {
  font-size: $font-size-xs;
  color: #666;
  font-family: $font-family-primary-regular;
  white-space: nowrap;
}

.register-form__progress-text {
  font-size: $font-size-xs;
  color: #666;
  font-family: $font-family-primary-regular;
  white-space: nowrap;
  margin-top: 4px;
  margin-left: 0;
  margin-right: 0;
}

.register-form__social-buttons {
  display: flex;
  gap: $space-xs;
  margin-bottom: $space-s;
}

.register-form__divider {
  display: flex;
  align-items: center;
  gap: $space-s;
  margin: $space-s 0;
}

.register-form__divider-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.register-form__divider-text {
  font-size: $font-size-xs;
  color: #666;
  font-family: $font-family-primary-regular;
  white-space: nowrap;
}

.register-form__form {
  display: flex;
  flex-direction: column;
  gap: $space-s;
}

.register-form__name-group {
  display: flex;
  gap: $space-xs;
}

.register-form__name-group .form-input {
  flex: 1;
}

.register-form__submit {
  width: 100%;
  padding: $space-s 0;
  background: $black;
  color: $white;
  border: none;
  border-radius: 0.5rem;
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: #333;
  }

  &:active {
    transform: translateY(1px);
  }
}

.register-form__back-btn {
  width: 100%;
  padding: $space-s 0;
  background: #f0f0f0;
  color: $black;
  border: none;
  border-radius: 0.5rem;
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  font-family: $font-family-primary-bold;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    transform: translateY(1px);
  }
}

.register-form__login {
  text-align: center;
  font-size: $font-size-xs;
  color: #666;
  font-family: $font-family-primary-regular;

  a {
    color: $black;
    text-decoration: none;
    font-weight: $font-weight-semi-bold;
    font-family: $font-family-primary-medium;
    transition: color 0.2s;

    &:hover {
      color: #333;
    }
  }
}

@media (max-height: 700px) {
  .register-form {
    gap: $space-xs;
    padding: $space-xs;
  }
  
  .register-form__header {
    margin-bottom: $space-s;
  }
  
  .register-form__title {
    font-size: $font-size-xl;
  }
  
  .register-form__subtitle {
    font-size: $font-size-s;
  }
}
</style> 