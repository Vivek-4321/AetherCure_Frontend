<template>
  <div class="reset-container">
    <div class="reset-card">
      <div class="header-section">
        <h2 class="reset-title">Set New Password</h2>
        <p class="reset-subtitle">Enter your new password below</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form-section">
        <div class="input-group">
          <label for="password" class="input-label">New Password</label>
          <div class="input-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              :disabled="isSubmitting"
              class="password-input"
              placeholder="Enter new password"
              :class="{ 'error': passwordError }"
              @input="validatePassword"
            />
            <button 
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <span v-if="showPassword">🔒</span>
              <span v-else>👁️</span>
            </button>
          </div>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <div class="input-group">
          <label for="confirmPassword" class="input-label">Confirm Password</label>
          <div class="input-wrapper">
            <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              :disabled="isSubmitting"
              class="password-input"
              placeholder="Confirm new password"
              :class="{ 'error': confirmPasswordError }"
              @input="validateConfirmPassword"
            />
            <button 
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span v-if="showConfirmPassword">🔒</span>
              <span v-else>👁️</span>
            </button>
          </div>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </div>

        <div class="password-requirements">
          <p class="requirement" :class="{ 'met': hasMinLength }">At least 8 characters</p>
          <p class="requirement" :class="{ 'met': hasUpperCase }">One uppercase letter</p>
          <p class="requirement" :class="{ 'met': hasLowerCase }">One lowercase letter</p>
          <p class="requirement" :class="{ 'met': hasNumber }">One number</p>
          <p class="requirement" :class="{ 'met': hasSpecial }">One special character</p>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isSubmitting || !isValidForm"
        >
          <span v-if="isSubmitting" class="loading-spinner"></span>
          <span>{{ isSubmitting ? 'Updating Password...' : 'Update Password' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const route = useRoute();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Password requirements
const hasMinLength = computed(() => password.value.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(password.value));
const hasLowerCase = computed(() => /[a-z]/.test(password.value));
const hasNumber = computed(() => /\d/.test(password.value));
const hasSpecial = computed(() => /[!@#$%^&*]/.test(password.value));

const isValidForm = computed(() => {
  return hasMinLength.value && 
         hasUpperCase.value && 
         hasLowerCase.value && 
         hasNumber.value && 
         hasSpecial.value &&
         password.value === confirmPassword.value;
});

const validatePassword = () => {
  passwordError.value = '';
  if (password.value && !hasMinLength.value) {
    passwordError.value = 'Password must be at least 8 characters long';
  }
  validateConfirmPassword();
};

const validateConfirmPassword = () => {
  confirmPasswordError.value = '';
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
  }
};

const handleSubmit = async () => {
  if (!isValidForm.value) return;

  const resetId = route.params.id as string;
  if (!resetId) {
    toast.error('Invalid reset link', {
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch('http://localhost:8000/resetPassVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resetId,
        newPassword: password.value
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    toast.success('Password updated successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    });

    // Redirect to login after short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update password';
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  const resetId = route.params.id as string;
  if (!resetId) {
    toast.error('Invalid reset link', {
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored'
    });
    router.push('/login');
  }
});
</script>

<style scoped>
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

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.reset-title {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.reset-subtitle {
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
  position: relative;
  margin-bottom: 1.5rem;
}

.input-label {
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.password-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: var(--secondary-bg);
  transition: all 0.2s ease;
}

.password-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.password-input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary);
}

.password-requirements {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--main-bg);
  border-radius: 8px;
  margin-top: -2rem;
}

.requirement {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.requirement::before {
  content: '×';
  color: #dc2626;
}

.requirement.met::before {
  content: '✓';
  color: #059669;
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
  margin-top: 1rem;
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
</style>