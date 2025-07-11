<template>
  <button class="btn primary" @click="$emit('click')">
    <slot>Continue</slot>
  </button>
</template>

<script setup>
// No additional logic needed for now
</script>