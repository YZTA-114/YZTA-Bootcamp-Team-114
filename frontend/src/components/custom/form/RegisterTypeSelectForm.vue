<template>
  <div class="register-type-select-form">
    <div class="register-type-select-form__header">
      <h1 class="register-type-select-form__title">Kayıt Tipi Seç</h1>
      <p class="register-type-select-form__subtitle">Lütfen kayıt tipinizi seçin.</p>
    </div>

    <div class="register-type-select-form__options">
      <button 
        class="register-type-select-form__option"
        @click="selectType('student')"
      >
        <div class="register-type-select-form__option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div class="register-type-select-form__option-content">
          <h3 class="register-type-select-form__option-title">Öğrenci olarak kayıt ol</h3>
          <p class="register-type-select-form__option-description">Öğrenci olarak kayıt olarak öğrenme malzemelerine ve kurslara erişin.</p>
        </div>
      </button>

      <button 
        class="register-type-select-form__option"
        @click="selectType('teacher')"
      >
        <div class="register-type-select-form__option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="register-type-select-form__option-content">
          <h3 class="register-type-select-form__option-title">Öğretmen olarak kayıt ol</h3>
          <p class="register-type-select-form__option-description">Öğretmen olarak kayıt olarak eğitim içeriği oluşturup yönetin.</p>
        </div>
      </button>
    </div>

    <div class="register-type-select-form__login">
      Zaten hesabın var mı? <router-link :to="{ name: 'login' }">Giriş Yap</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const selectType = (type) => {
  if (type === 'student') {
    router.push({ name: 'register-student' })
  } else if (type === 'teacher') {
    router.push({ name: 'register-teacher' })
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.register-type-select-form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
  padding: $space-s;
}

.register-type-select-form__header {
  text-align: center;
  margin-bottom: $space-m;
}

.register-type-select-form__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $black;
  margin: 0 0 $space-xs 0;
  font-family: $font-family-primary-bold;
  line-height: 1.2;
}

.register-type-select-form__subtitle {
  font-size: $font-size-s;
  color: #666;
  margin: 0;
  font-family: $font-family-primary-regular;
  line-height: 1.5;
}

.register-type-select-form__options {
  display: flex;
  flex-direction: column;
  gap: $space-s;
  margin-bottom: $space-m;
}

.register-type-select-form__option {
  display: flex;
  align-items: center;
  gap: $space-s;
  padding: $space-s;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  background: $white;
  color: $black;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: $black;
    background: #f8f8f8;
  }

  &:active {
    transform: translateY(1px);
  }
}

.register-type-select-form__option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 0.5rem;
  color: $black;
  flex-shrink: 0;
}

.register-type-select-form__option-content {
  flex: 1;
}

.register-type-select-form__option-title {
  font-size: $font-size-s;
  font-weight: $font-weight-bold;
  color: $black;
  margin: 0 0 $space-2xs 0;
  font-family: $font-family-primary-bold;
}

.register-type-select-form__option-description {
  font-size: $font-size-xs;
  color: #666;
  margin: 0;
  font-family: $font-family-primary-regular;
  line-height: 1.4;
}

.register-type-select-form__login {
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
  .register-type-select-form {
    gap: $space-xs;
    padding: $space-xs;
  }
  
  .register-type-select-form__header {
    margin-bottom: $space-s;
  }
  
  .register-type-select-form__title {
    font-size: $font-size-l;
  }
  
  .register-type-select-form__subtitle {
    font-size: $font-size-xs;
  }
}
</style> 