<template>
  <button class="btn secondary" @click="$emit('click')">
    <slot>Continue</slot>
  </button>
</template>

<script setup>
// No additional logic needed for now
</script>
