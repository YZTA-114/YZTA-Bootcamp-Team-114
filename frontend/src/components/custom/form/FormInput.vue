<template>
  <div class="form-input">
    <label v-if="label" :for="id" class="form-input__label">{{ label }}</label>
    <div class="form-input__wrapper">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="form-input__field"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="form-input__toggle"
        @click="togglePassword"
        tabindex="-1"
        aria-label="Toggle password visibility"
      >
        <svg v-if="showPassword" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#bbb" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" stroke="#bbb" stroke-width="2"/>
        </svg>
        <svg v-else width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#bbb" stroke-width="2"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="#bbb" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'focus', 'blur'])

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/custom/_variable.scss';

.form-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-2xs;
}

.form-input__label {
  font-size: $font-size-xs;
  color: $black;
  font-weight: $font-weight-semi-bold;
  font-family: $font-family-primary-medium;
  margin-bottom: 0;
}

.form-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input__field {
  width: 100%;
  padding: $space-2xs $space-s;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: $font-size-s;
  background: $white;
  color: $black;
  font-family: $font-family-primary-regular;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border: 1.5px solid $black;
  }

  &::placeholder {
    color: #bbb;
  }

  &:disabled {
    background: #f5f5f5;
    color: #bbb;
    cursor: not-allowed;
  }
}

.form-input__toggle {
  background: none;
  border: none;
  position: absolute;
  right: $space-xs;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  transition: color 0.2s;

  &:hover {
    color: $black;
  }
}
</style> 