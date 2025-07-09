<template>
  <div class="error-layout">
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="ri-error-warning-line"></i>
        </div>
        
        <h1 class="error-title">
          {{ computedErrorTitle }}
        </h1>
        
        <p class="error-message">
          {{ computedErrorMessage }}
        </p>
        
        <div class="error-actions">
          <button 
            @click="goBack" 
            class="btn btn-secondary"
            v-if="showBackButton"
          >
            <i class="ri-arrow-left-line"></i>
            Go Back
          </button>
          
          <button 
            @click="goHome" 
            class="btn btn-primary"
          >
            <i class="ri-home-line"></i>
            Go Home
          </button>
        </div>
        
        <div class="error-details" v-if="errorDetails">
          <details>
            <summary>Error Details</summary>
            <pre class="error-code">{{ errorDetails }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props for error configuration
const props = defineProps({
  errorCode: {
    type: String,
    default: '404'
  },
  errorTitle: {
    type: String,
    default: 'Page Not Found'
  },
  errorMessage: {
    type: String,
    default: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  },
  errorDetails: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: true
  }
})

// Computed properties for dynamic error handling
const computedErrorTitle = computed(() => {
  if (props.errorCode === '404') {
    return 'Page Not Found'
  } else if (props.errorCode === '500') {
    return 'Internal Server Error'
  } else if (props.errorCode === '403') {
    return 'Access Forbidden'
  } else if (props.errorCode === '401') {
    return 'Unauthorized Access'
  }
  return props.errorTitle
})

const computedErrorMessage = computed(() => {
  if (props.errorCode === '404') {
    return 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  } else if (props.errorCode === '500') {
    return 'Something went wrong on our end. Please try again later or contact support if the problem persists.'
  } else if (props.errorCode === '403') {
    return 'You don\'t have permission to access this resource. Please contact your administrator if you believe this is an error.'
  } else if (props.errorCode === '401') {
    return 'You need to be authenticated to access this resource. Please log in and try again.'
  }
  return props.errorMessage
})

// Navigation methods
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $mirage;
  padding: $space-m;
}

.error-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: $space-2xl;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: $space-l;
  
  i {
    display: block;
  }
}

.error-title {
  font-family: $font-family-primary-bold;
  font-size: $font-size-3xl;
  color: $amour;
  margin-bottom: $space-m;
  font-weight: $font-weight-bold;
}

.error-message {
  font-family: $font-family-primary-regular;
  font-size: $font-size-m;
  color: $grey;
  line-height: 1.6;
  margin-bottom: $space-xl;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: $space-m;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: $space-xl;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2xs;
  padding: $space-s $space-l;
  border-radius: 8px;
  font-family: $font-family-primary-medium;
  font-size: $font-size-s;
  font-weight: $font-weight-semi-bold;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  i {
    font-size: 1.1em;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.btn-primary {
  background: linear-gradient(135deg, $leight-beige, #d4ff8a);
  color: $oil;
  
  &:hover {
    background: linear-gradient(135deg, #d4ff8a, $leight-beige);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: $amour;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.error-details {
  margin-top: $space-l;
  
  details {
    text-align: left;
    
    summary {
      font-family: $font-family-primary-medium;
      font-size: $font-size-s;
      color: $amour;
      cursor: pointer;
      padding: $space-s;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      margin-bottom: $space-s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
  
  .error-code {
    background: rgba(0, 0, 0, 0.3);
    color: #ff6b6b;
    padding: $space-m;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: $font-size-xs;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    border: 1px solid rgba(255, 107, 107, 0.2);
  }
}

// Responsive design
@media only screen and (max-width: 768px) {
  .error-layout {
    padding: $space-s;
  }
  
  .error-content {
    padding: $space-xl;
  }
  
  .error-icon {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: $font-size-2xl;
  }
  
  .error-message {
    font-size: $font-size-s;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .btn {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }
  }
}

@media only screen and (max-width: 480px) {
  .error-content {
    padding: $space-l;
  }
  
  .error-icon {
    font-size: 2.5rem;
  }
  
  .error-title {
    font-size: $font-size-xl;
  }
}
</style>