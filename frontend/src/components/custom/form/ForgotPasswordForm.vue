<template>
  <div class="forgot-password-form">
    <div class="forgot-password-form__header">
      <h1 class="forgot-password-form__title">Forgot Password?</h1>
      <p class="forgot-password-form__subtitle">Don't worry! It happens. Please enter the address associated with your account.</p>
    </div>

    <form class="forgot-password-form__form" @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        id="forgot-email"
        required
      />

      <button type="submit" class="forgot-password-form__submit">
        SUBMIT
      </button>
    </form>

    <div class="forgot-password-form__back">
      <router-link :to="{ name: 'login' }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormInput from '@/components/custom/form/FormInput.vue'

const form = ref({
  email: ''
})

const handleSubmit = () => {
  console.log('Forgot password form submitted:', form.value)
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.forgot-password-form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
  padding: $space-s;
}

.forgot-password-form__header {
  text-align: center;
  margin-bottom: $space-m;
}

.forgot-password-form__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $black;
  margin: 0 0 $space-xs 0;
  font-family: $font-family-primary-bold;
  line-height: 1.2;
}

.forgot-password-form__subtitle {
  font-size: $font-size-s;
  color: #666;
  margin: 0;
  font-family: $font-family-primary-regular;
  line-height: 1.5;
}

.forgot-password-form__form {
  display: flex;
  flex-direction: column;
  gap: $space-s;
}

.forgot-password-form__submit {
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

.forgot-password-form__back {
  text-align: center;
  margin-top: $space-s;
}

.forgot-password-form__back a {
  display: inline-flex;
  align-items: center;
  gap: $space-2xs;
  color: $black;
  text-decoration: none;
  font-size: $font-size-xs;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
  transition: color 0.2s;

  &:hover {
    color: #666;
  }
}

@media (max-height: 700px) {
  .forgot-password-form {
    gap: $space-xs;
    padding: $space-xs;
  }
  
  .forgot-password-form__header {
    margin-bottom: $space-s;
  }
  
  .forgot-password-form__title {
    font-size: $font-size-xl;
  }
  
  .forgot-password-form__subtitle {
    font-size: $font-size-s;
  }
}
</style> 