<template>
  <LoginLayout>
    <template #left>
      <LoginForm />
    </template>
    <template #right>
      <TestimonialPanel />
    </template>
  </LoginLayout>
</template>

<script setup>
import LoginLayout from "@/layout/main/LoginLayout.vue";
import LoginForm from "@/components/custom/login/LoginForm.vue";
import TestimonialPanel from "@/components/custom/auth/TestimonialPanel.vue";
</script>