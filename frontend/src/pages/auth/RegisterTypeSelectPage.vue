<template>
  <LoginLayout>
    <template #left>
      <RegisterTypeSelectForm />
    </template>
    <template #right>
      <TestimonialPanel />
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from '@/layout/main/LoginLayout.vue';
import RegisterTypeSelectForm from '@/components/custom/form/RegisterTypeSelectForm.vue';
import TestimonialPanel from '@/components/custom/auth/TestimonialPanel.vue';
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_auth.scss';
.register-type-select {
  @extend .auth-form;
  gap: $space-l;
  border: 1.5px solid $orange;
  border-radius: 0.5rem;
  padding: $space-l;
}
.register-type-select__title {
  @extend .auth-form__title;
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
  @extend .auth-form__login-link;
}
</style> 