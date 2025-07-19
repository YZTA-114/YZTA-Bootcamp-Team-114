<template>
  <div class="login-form">
    <div class="login-form__header">
      <h1 class="login-form__title">Hello, Welcome Back!</h1>
      <p class="login-form__subtitle">We're happy to see you again, let's Stay ahead of the game.</p>
    </div>

    <div class="login-form__social-buttons">
      <SocialLoginButton provider="google" @click="handleGoogleLogin" />
      <SocialLoginButton provider="apple" @click="handleAppleLogin" />
    </div>

    <div class="login-form__divider">
      <span class="login-form__divider-line"></span>
      <span class="login-form__divider-text">Or Continue With</span>
      <span class="login-form__divider-line"></span>
    </div>

    <form class="login-form__form" @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        id="login-email"
        required
      />
      
      <FormInput
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        id="login-password"
        required
      />

      <div class="login-form__forgot">
        <router-link :to="{ name: 'forgot-password' }">Forgot Password?</router-link>
      </div>

      <button type="submit" class="login-form__submit">
        LOGIN
      </button>
    </form>

    <div class="login-form__signup">
      Don't have an account? <router-link :to="{ name: 'register-type-select' }">Sign up for free</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormInput from '@/components/custom/form/FormInput.vue'
import SocialLoginButton from '@/components/custom/form/SocialLoginButton.vue'

const form = ref({
  email: 'sadeghsadegil999@gmail.com',
  password: '••••••••'
})

const handleSubmit = () => {
  console.log('Login form submitted:', form.value)
}

const handleGoogleLogin = () => {
  console.log('Google login clicked')
}

const handleAppleLogin = () => {
  console.log('Apple login clicked')
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.login-form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: $space-s;
  padding: $space-s;
}

.login-form__header {
  text-align: center;
  margin-bottom: $space-m;
}

.login-form__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $black;
  margin: 0 0 $space-xs 0;
  font-family: $font-family-primary-bold;
  line-height: 1.2;
}

.login-form__subtitle {
  font-size: $font-size-s;
  color: #666;
  margin: 0;
  font-family: $font-family-primary-regular;
  line-height: 1.5;
}

.login-form__social-buttons {
  display: flex;
  gap: $space-xs;
  margin-bottom: $space-s;
}

.login-form__divider {
  display: flex;
  align-items: center;
  gap: $space-s;
  margin: $space-s 0;
}

.login-form__divider-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.login-form__divider-text {
  font-size: $font-size-xs;
  color: #666;
  font-family: $font-family-primary-regular;
  white-space: nowrap;
}

.login-form__form {
  display: flex;
  flex-direction: column;
  gap: $space-s;
}

.login-form__forgot {
  text-align: right;
  margin-bottom: $space-xs;
}

.login-form__forgot a {
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

.login-form__submit {
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

.login-form__signup {
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
  .login-form {
    gap: $space-xs;
    padding: $space-xs;
  }
  
  .login-form__header {
    margin-bottom: $space-s;
  }
  
  .login-form__title {
    font-size: $font-size-xl;
  }
  
  .login-form__subtitle {
    font-size: $font-size-s;
  }
}
</style> 