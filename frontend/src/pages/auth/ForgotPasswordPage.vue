<template>
  <LoginLayout>
    <template #left>
      <ForgotPasswordForm />
    </template>
    <template #right>
      <TestimonialPanel />
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
import ForgotPasswordForm from '@/components/custom/form/ForgotPasswordForm.vue';
import TestimonialPanel from '@/components/custom/auth/TestimonialPanel.vue';
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