<template>
  <div class="custom-text-input">
    <input
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
      type="text"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomTextInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Email'
    }
  }
}
</script>

<style scoped>
.custom-text-input {
  display: flex;
  align-items: center;
  background: #232228;
  border-radius: 16px;
  border: 1px solid #35343b;
  padding: 0.5rem 1rem;
  height: 44px;
  width: 100%;
  box-sizing: border-box;
}
.icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
}
.input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
  width: 100%;
}
.input::placeholder {
  color: #888;
  opacity: 1;
}
</style> 