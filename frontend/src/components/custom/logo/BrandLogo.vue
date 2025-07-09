<template>
  <div class="brand-logo">
    <img src="@/assets/images/logo.png" alt="Brand Logo" :width="props.width" :height="props.height" />
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 32
  },
  height: {
    type: Number,
    default: 32
  }
})
</script>
