<template>
  <div class="create-classroom-page">
    <div class="create-classroom-container">
      <h1>Yeni Sınıf Oluştur</h1>
      <form @submit.prevent="handleSubmit" class="create-classroom-form">
        <div class="form-group">
          <label for="className">Sınıf Adı</label>
          <input
            type="text"
            id="className"
            v-model="formData.name"
            placeholder="Sınıf adını giriniz"
            :disabled="isLoading"
          />
          <div class="error-text" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </div>
        </div>
        <div class="form-group">
          <label for="description">Açıklama</label>
          <input
            type="text"
            id="description"
            v-model="formData.description"
            placeholder="Sınıfın açıklamasını giriniz"
            :disabled="isLoading"
          />
          <div class="error-text" v-if="v$.description.$error">
            {{ v$.description.$errors[0].$message }}
          </div>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="goBack" :disabled="isLoading">İptal</button>
          <button type="submit" class="submit-btn" :disabled="isLoading || v$.$invalid">
            <span v-if="isLoading">Oluşturuluyor...</span>
            <span v-else>Oluştur</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import { useAsyncState } from '@vueuse/core'

const router = useRouter()
const store = useStore()
const toast = useToast()

const formData = ref({
  name: '',
  description: ''
})

// Validation rules
const rules = {
  name: { 
    required, 
    minLength: minLength(3), 
    maxLength: maxLength(50)
  },
  description: { 
    required, 
    minLength: minLength(5), 
    maxLength: maxLength(200)
  }
}

// Initialize vuelidate
const v$ = useVuelidate(rules, formData)

const isLoading = computed(() => state.isLoading)
const error = computed(() => store.getters['classroom/getError'])

// Create classroom async state
const { state, execute } = useAsyncState(
  async () => {
    try {
      await v$.value.$validate()
      if (v$.value.$invalid) return

      await store.dispatch('classroom/createClassroom', {
        name: formData.value.name,
        description: formData.value.description
      })
      toast.success('Sınıf başarıyla oluşturuldu')
      router.push('/teacher/dashboard')
    } catch (error) {
      toast.error(error.message || 'Sınıf oluşturulurken bir hata oluştu')
      throw error
    }
  },
  null,
  { immediate: false }
)

const handleSubmit = async () => {
  execute()
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.create-classroom-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.create-classroom-container {
  background: #232323;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);

  h1 {
    color: #fff;
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
}

.create-classroom-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #fff;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 0.8rem;
      border: 1.5px solid #888;
      border-radius: 8px;
      background: #232323;
      color: #fff;
      font-size: 1rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #ff6b6b;
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .error-text {
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  }
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;

  button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .cancel-btn {
    background: transparent;
    border: 1.5px solid #888;
    color: #fff;

    &:hover:not(:disabled) {
      border-color: #ff6b6b;
    }
  }

  .submit-btn {
    background: #ff6b6b;
    border: none;
    color: #fff;

    &:hover:not(:disabled) {
      background: darken(#ff6b6b, 10%);
    }
  }
}
</style> 