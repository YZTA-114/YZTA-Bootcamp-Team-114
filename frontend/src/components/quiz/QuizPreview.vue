<template>
  <div class="quiz-preview" v-if="props.show">
    <div class="preview-overlay" @click="$emit('close')"></div>
    <div class="preview-modal">
      <div class="preview-header">
        <h2>Çıkarılan Soruları Önizle</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="preview-content">
        <div class="file-info">
          <h3>Dosya Bilgileri</h3>
          <p><strong>Dosya Adı:</strong> {{ props.extractedData.filename }}</p>
          <p><strong>Dosya Türü:</strong> {{ props.extractedData.fileType }}</p>
          <p><strong>Toplam Soru:</strong> {{ props.extractedData.length || 0 }}</p>
        </div>

        <div class="questions-preview">
          <h3>Sorular</h3>
          <div class="questions-list">
            <div v-for="(question, index) in props.extractedData" :key="index" class="question-item">
              <div class="question-header">
                <span class="question-number">Soru {{ index + 1 }}</span>
                <span class="question-type">{{ getQuestionTypeText(question.type) }}</span>
              </div>
              <div class="question-content">
                <p class="question-text">{{ question.question }}</p>
                <div class="options-list">
                  <div v-for="(option, optIndex) in question.options" :key="optIndex" 
                       class="option-item" :class="{ 'correct': option.isCorrect }">
                    <span class="option-letter">{{ ['A', 'B', 'C', 'D', 'E'][optIndex] }}</span>
                    <span class="option-text">{{ option.content }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-actions">
        <button class="btn-secondary" @click="$emit('close')">İptal</button>
        <button class="btn-primary" @click="$emit('confirm')" :disabled="props.isLoading">
          <span v-if="props.isLoading" class="loading-spinner"></span>
          {{ props.isLoading ? 'İşleniyor...' : 'Quizi Oluştur' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  extractedData: {
    type: Array,
    required: true,
    validator: (value) => {
      if (!Array.isArray(value)) return false
      return value.every(question => 
        question &&
        typeof question.question === 'string' &&
        Array.isArray(question.options) &&
        question.options.every(option => 
          typeof option.content === 'string' &&
          typeof option.isCorrect === 'boolean'
        )
      )
    }
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])

const getQuestionTypeText = (type) => {
  const types = {
    'multiple_choice': 'Çoktan Seçmeli',
    'true_false': 'Doğru/Yanlış',
    'open_ended': 'Açık Uçlu'
  }
  return types[type] || 'Çoktan Seçmeli'
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.quiz-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.preview-modal {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: #111;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #222;

  h2 {
    color: #fff;
    font-size: 1.5rem;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  .file-info {
    background: #181818;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;

    h3 {
      color: #fff;
      font-size: 1.2rem;
      margin: 0 0 16px 0;
    }

    p {
      color: #888;
      margin: 8px 0;

      strong {
        color: #fff;
        margin-right: 8px;
      }
    }
  }
}

.questions-preview {
  h3 {
    color: #fff;
    font-size: 1.2rem;
    margin: 0 0 20px 0;
  }
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-item {
  background: #181818;
  border-radius: 12px;
  overflow: hidden;

  .question-header {
    background: #222;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .question-number {
      color: $orange;
      font-weight: 600;
    }

    .question-type {
      color: #666;
      font-size: 0.9rem;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  }

  .question-content {
    padding: 20px;

    .question-text {
      color: #fff;
      font-size: 1.1rem;
      margin: 0 0 16px 0;
    }
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #222;
  border-radius: 8px;
  transition: background 0.2s;

  &.correct {
    background: rgba($orange, 0.2);
    border: 1px solid rgba($orange, 0.3);
  }

  .option-letter {
    color: #666;
    font-weight: 600;
    min-width: 24px;
  }

  .option-text {
    color: #fff;
  }
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 32px;
  border-top: 1px solid #222;

  button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-secondary {
    background: #333;
    color: #fff;

    &:hover {
      background: #444;
    }
  }

  .btn-primary {
    background: $orange;
    color: #fff;

    &:hover:not(:disabled) {
      background: darken($orange, 10%);
    }

    &:disabled {
      background: #666;
      cursor: not-allowed;
    }
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 