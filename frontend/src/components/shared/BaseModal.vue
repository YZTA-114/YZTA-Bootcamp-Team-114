<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <slot name="header"></slot>
        <button class="close-button" @click="$emit('close')">
          <ri-close-line />
        </button>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['close'])

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: $white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba($black, 0.2);

  .modal-header {
    padding: $space-m;
    border-bottom: 1px solid rgba($black, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: $font-size-l;
      font-weight: $font-weight-semi-bold;
      color: $black;
    }

    .close-button {
      background: none;
      border: none;
      padding: $space-xs;
      border-radius: 6px;
      cursor: pointer;
      color: rgba($black, 0.6);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba($black, 0.05);
        color: $black;
      }
    }
  }

  .modal-body {
    padding: $space-m;
  }

  .modal-footer {
    padding: $space-m;
    border-top: 1px solid rgba($black, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: $space-s;
  }
}

// Dark theme overrides
body[data-theme="dark"] {
  .modal {
    background: #111;
    border: 2px solid rgba($orange, 0.5);

    .modal-header {
      border-bottom-color: rgba($white, 0.1);

      h2 {
        color: $white;
      }

      .close-button {
        color: rgba($white, 0.6);

        &:hover {
          background: rgba($white, 0.1);
          color: $white;
        }
      }
    }

    .modal-footer {
      border-top-color: rgba($white, 0.1);
    }
  }
}</style> 