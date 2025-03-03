<!-- Signup.vue -->
<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const username = ref(""); // Changed from fullName to username to match API
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const isAnimating = ref(false);

const formStyle = reactive({
  transform: "translateX(0)",
  opacity: 1,
});

const passwordStrength = computed(() => {
  if (password.value.length === 0) return "";

  const hasLowerCase = /[a-z]/.test(password.value);
  const hasUpperCase = /[A-Z]/.test(password.value);
  const hasNumber = /\d/.test(password.value);
  const hasSpecialChar = /[!@#$%^&*]/.test(password.value);
  const isLongEnough = password.value.length >= 8;

  if (hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough) {
    return "Strong";
  } else if ((hasLowerCase || hasUpperCase) && hasNumber && isLongEnough) {
    return "Medium";
  } else {
    return "Weak";
  }
});

const handleSignup = async () => {
  if (!email.value || !username.value || !password.value) {
    toast.error('All fields are required', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }

  if (passwordStrength.value === "Weak") {
    toast.warning('Please choose a stronger password', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch('https://high-goose-81-cqfnq4drn6zh.deno.dev/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const result = await response.json();
    
    toast.success('OTP sent to your email', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });

    // Store email in localStorage for verification page
    localStorage.setItem('signupEmail', email.value);
    
    // Wait for toast to be visible before redirecting
    setTimeout(() => {
      router.push(`otp/${result.id}`);
    }, 1000);

  } catch (error) {
    let errorMessage = 'An error occurred during signup';
    
    if (error.message.includes('userAlreadyExists')) {
      errorMessage = 'Email is already registered';
    } else if (error.message.includes('username already exists')) {
      errorMessage = 'Username is already taken';
    } else if (error.message.includes('ValidationError')) {
      errorMessage = 'Please fill all required fields';
    }

    toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="auth-container" :class="{ animating: isAnimating }">
    <div class="left-panel">
      <div class="logo"></div>
      <h1>Start Your Health Journey</h1>
      <p>Join our blockchain-powered AI health prediction platform.</p>
      <div class="fact-box">
        <h3>Did You Know?</h3>
        <p>Blockchain ensures your health data remains private and secure while enabling personalized predictions.</p>
      </div>
    </div>
    <div class="right-panel">
      <form @submit.prevent="handleSignup" :style="formStyle">
        <h2>Join the future of health</h2>
        <p>Create your account now</p>
        <div class="input-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="johnsmith"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="john@example.com"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          />
          <span
            v-if="passwordStrength"
            class="password-strength"
            :class="passwordStrength.toLowerCase()"
          >
            {{ passwordStrength }}
          </span>
        </div>
        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="!isLoading">Sign Up</span>
          <span v-else class="spinner"></span>
        </button>
        <button type="button" class="google-btn" :disabled="isLoading">
          <span class="google-icon"></span>
          Sign up with Google
        </button>
        <p class="toggle-form">
          Already have an account?
          <a href="#" @click.prevent="goToLogin">Log In</a>
        </p>
      </form>
    </div>
  </div>
</template>
