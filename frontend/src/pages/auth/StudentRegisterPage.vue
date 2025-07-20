<template>
  <LoginLayout>
    <template #left>
      <RegisterForm userType="student" />
    </template>
    <template #right>
      <TestimonialPanel />
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
import RegisterForm from '@/components/custom/form/RegisterForm.vue';
import TestimonialPanel from '@/components/custom/auth/TestimonialPanel.vue';
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_auth.scss';
.register-form {
  @extend .auth-form;
}
.register-form__title {
  @extend .auth-form__title;
}
.register-form__progress {
  @extend .auth-form__progress;
}
.register-form__progress-step {
  @extend .auth-form__progress-step;
}
.register-form__progress-number {
  @extend .auth-form__progress-number;
}
.register-form__progress-text {
  @extend .auth-form__progress-text;
}
.register-form__label {
  @extend .auth-form__label;
}
.register-form__fields {
  @extend .auth-form__fields;
}
.register-form__input {
  @extend .auth-form__input;
}
.register-form__buttons {
  @extend .auth-form__buttons;
}
.register-form__back-btn {
  @extend .auth-form__back-btn;
}
.register-form__submit {
  @extend .auth-form__submit;
}
.register-form__login-link {
  @extend .auth-form__login-link;
}
</style> 