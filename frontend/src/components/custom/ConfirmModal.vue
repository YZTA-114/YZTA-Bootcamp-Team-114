<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#d32f2f"/>
          </svg>
        </div>
        <h3 class="modal-title">{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p class="modal-message">{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="cancel">
          {{ cancelText }}
        </button>
        <button class="btn btn-danger" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Onay'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Evet'
  },
  cancelText: {
    type: String,
    default: 'İptal'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}

const closeModal = () => {
  emit('close')
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #232323;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: $space-l;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: $space-s;
  margin-bottom: $space-m;

  .modal-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(211, 47, 47, 0.1);
  }

  .modal-title {
    color: #fff;
    font-size: $font-size-l;
    font-weight: $font-weight-semi-bold;
    margin: 0;
  }
}

.modal-body {
  margin-bottom: $space-l;

  .modal-message {
    color: #ccc;
    font-size: $font-size-s;
    line-height: 1.5;
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  gap: $space-s;
  justify-content: flex-end;

  .btn {
    padding: $space-s $space-l;
    border-radius: 8px;
    font-weight: $font-weight-semi-bold;
    font-size: $font-size-s;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    outline: none;

    &.btn-secondary {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
      }
    }

    &.btn-danger {
      background-color: $orange;
      color: #fff;
      border: 1px solid $orange;

      &:hover {
        background-color: darken($orange, 10%);
        border-color: darken($orange, 10%);
        transform: translateY(-1px);
      }
    }
  }
}
</style> 