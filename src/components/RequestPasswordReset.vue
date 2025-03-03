<template>
    <div class="reset-container">
      <div class="reset-card">
        <div class="header-section">
          <h2 class="reset-title">Request Password Reset</h2>
          <p class="reset-subtitle">Verify your email to receive a password reset link</p>
        </div>
  
        <form @submit.prevent="handleSubmit" class="form-section">
          <div class="input-group">
            <label for="email" class="input-label">Email Address</label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                v-model="email"
                :disabled="isSubmitting"
                class="email-input"
                placeholder="Enter your registered email"
                :class="{ 'error': emailError }"
                @input="clearError"
              />
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>
          </div>
  
          <button 
            type="submit" 
            class="submit-button"
            :disabled="isSubmitting || !email"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span>{{ isSubmitting ? 'Sending...' : 'Send Reset Link' }}</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue3-toastify';
  
  const router = useRouter();
  const email = ref('');
  const emailError = ref('');
  const isSubmitting = ref(false);
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const clearError = () => {
    emailError.value = '';
  };
  
  const handleSubmit = async () => {
    clearError();
  
    if (!email.value) {
      emailError.value = 'Email is required';
      return;
    }
  
    if (!validateEmail(email.value)) {
      emailError.value = 'Please enter a valid email address';
      return;
    }
  
    isSubmitting.value = true;
  
    try {
      const response = await fetch('http://localhost:8000/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for authentication
        body: JSON.stringify({ email: email.value })
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      toast.success('Reset link sent to your email!', {
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored'
      });
  
      email.value = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset link';
      if (message.includes('forbidden')) {
        emailError.value = 'This email does not match your account';
      } else {
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
      }
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Styles from previous components - same theme */
  .reset-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bg);
    padding: 1rem;
  }
  
  .reset-card {
    padding: 2.5rem;
    border-radius: 12px;
    width: 100%;
    max-width: 440px;
  }

  .forgot-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bg);
    padding: 1rem;
  }
  
  .forgot-card {
    padding: 2.5rem;
    border-radius: 12px;
    width: 100%;
    max-width: 440px;
  }
  
  .header-section {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .forgot-title {
    color: var(--text-primary);
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .forgot-subtitle {
    color: var(--text-secondary);
    font-size: var(--font-size-base);
    line-height: 1.5;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .input-label {
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-weight: 500;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .email-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: var(--font-size-base);
    color: var(--text-primary);
    background-color: var(--secondary-bg);
    transition: all 0.2s ease;
  }
  
  .email-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
  
  .email-input.error {
    border-color: #dc2626;
  }
  
  .error-message {
    position: absolute;
    left: 0;
    bottom: -1.5rem;
    color: #dc2626;
    font-size: 0.875rem;
  }
  
  .submit-button {
    width: 100%;
    padding: 0.875rem;
    background-color: var(--accent-color);
    color: var(--common-white);
    border: none;
    border-radius: 8px;
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: var(--hover-accent);
  }
  
  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading-spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--common-white);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .back-section {
    text-align: center;
    margin-top: 1rem;
  }
  
  .back-link {
    color: var(--accent-color);
    text-decoration: none;
    font-size: var(--font-size-base);
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: var(--hover-accent);
  }
  </style>