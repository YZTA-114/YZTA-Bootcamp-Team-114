<template>
  <div class="register-form">
    <div class="register-form__header">
      <h1 class="register-form__title">Create Your Account</h1>
      <p class="register-form__subtitle">Join us and start your journey today.</p>
    </div>

    <div class="register-form__social-buttons">
      <SocialLoginButton provider="google" @click="handleGoogleRegister" />
      <SocialLoginButton provider="apple" @click="handleAppleRegister" />
    </div>

    <div class="register-form__divider">
      <span class="register-form__divider-line"></span>
      <span class="register-form__divider-text">Or Continue With</span>
      <span class="register-form__divider-line"></span>
    </div>

    <form class="register-form__form" @submit.prevent="handleSubmit">
      <div class="register-form__name-group">
        <FormInput
          v-model="form.firstName"
          type="text"
          label="First Name"
          placeholder="Enter your first name"
          id="register-first-name"
          required
        />
        <FormInput
          v-model="form.lastName"
          type="text"
          label="Last Name"
          placeholder="Enter your last name"
          id="register-last-name"
          required
        />
      </div>

      <FormInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        id="register-email"
        required
      />
      
      <FormInput
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="Create a password"
        id="register-password"
        required
      />

      <FormInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        id="register-confirm-password"
        required
      />

      <button type="submit" class="register-form__submit">
        SIGN UP
      </button>
    </form>

    <div class="register-form__login">
      Already have an account? <router-link :to="{ name: 'login' }">Sign in</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormInput from '@/components/custom/form/FormInput.vue'
import SocialLoginButton from '@/components/custom/form/SocialLoginButton.vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  console.log('Register form submitted:', form.value)
}

const handleGoogleRegister = () => {
  console.log('Google register clicked')
}

const handleAppleRegister = () => {
  console.log('Apple register clicked')
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