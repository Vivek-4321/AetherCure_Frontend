<!-- Signup.vue -->
<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const fullName = ref("");
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
      <form @submit.prevent :style="formStyle">
        <h2>Join the future of health</h2>
        <p>Create your account now</p>
        <div class="input-group">
          <label for="fullName">Full name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="Dr. John Smith"
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
          {{ isLoading ? "Processing..." : "Sign Up" }}
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
