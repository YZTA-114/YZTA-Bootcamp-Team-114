<template>
  <button 
    type="button" 
    class="social-login-button"
    @click="$emit('click')"
  >
    <img v-if="provider === 'google'" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
    <svg v-else-if="provider === 'apple'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
    {{ provider === 'google' ? 'Google' : 'Apple' }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  provider: {
    type: String,
    required: true,
    validator: (value) => ['google', 'apple'].includes(value)
  }
})

defineEmits(['click'])
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.social-login-button {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-2xs;
  justify-content: center;
  padding: $space-2xs 0;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  background: $white;
  color: $black;
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $black;
    background: #f8f8f8;
  }

  img {
    width: 20px;
    height: 20px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style> 