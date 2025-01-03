<!-- Login.vue -->
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const isAnimating = ref(false);

const formStyle = reactive({
  transform: "translateX(0)",
  opacity: 1,
});

const goToSignup = () => {
  router.push('/signup');
};

</script>

<template>
  <div class="auth-container" :class="{ animating: isAnimating }">
    <div class="left-panel" :class="{ login: true }">
      <div class="logo"></div>
      <h1>Aether Cure</h1>
      <p>Access personalized health predictions powered by AI and blockchain.</p>
      <div class="fact-box" :class="{ login: true }">
        <h3>Did You Know?</h3>
        <p>AI can predict cardiovascular issues with 80% accuracy using retinal scans.</p>
      </div>
    </div>
    <div class="right-panel">
      <form @submit.prevent :style="formStyle">
        <h2>Welcome back</h2>
        <p>Log in to your account</p>
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
        </div>
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? "Processing..." : "Log In" }}
        </button>
        <button type="button" class="google-btn" :disabled="isLoading">
          <span class="google-icon"></span>
          Log in with Google
        </button>
        <p class="toggle-form">
          Don't have an account?
          <a href="#" @click.prevent="goToSignup">Sign Up</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style>
body{
    background-color: var(--main-bg);
}

.auth-container {
  display: flex;
  background-color: var(--secondary-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 900px;
  height: 600px;
  overflow: hidden;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
  margin: 6% auto;
}

.auth-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.left-panel {
  flex: 1;
  background-color: var(--main-bg);
  padding: 40px;
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
  color: var(--common-white);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  margin: 0.8rem;
  border-radius: 0.5rem;
  width: 45%;
  height: 95%;

}

.left-panel.login {
  background-color: var(--main-bg);
  color: var(--text-primary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  width: 40px;
  height: 40px;
  background-color: transparent;
  border-radius: 8px;
  margin-bottom: 40px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.left-panel h1 {
  font-size: 28px;
  margin-bottom: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.left-panel > p {
  font-size: 16px;
  margin-bottom: 40px;
  opacity: 0.9;
  color: var(--text-secondary);
}

.fact-box {
  background-color: var(--accent-color);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.fact-box.login {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.fact-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.fact-box h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--common-white);
}

.fact-box p {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: var(--common-white);
}

.right-panel {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.5s ease;
  background-color: var(--secondary-bg);
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.5s ease;
  text-align: left;
}

h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 0;
  font-weight: 700;
}

form > p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  padding: 10px 12px;
  border: 1.5px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: var(--secondary-bg);
  color: var(--text-primary);
}

input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.password-strength {
  position: absolute;
  right: 12px;
  top: 38px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.password-strength.weak {
  color: #ef4444;
}

.password-strength.medium {
  color: #f59e0b;
}

.password-strength.strong {
  color: #10b981;
}

.submit-btn {
  background-color: var(--accent-color);
  color: var(--common-white);
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.submit-btn:hover {
  background-color: var(--hover-accent);
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

.google-btn {
  background-color: var(--secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background-color: var(--main-bg);
  transform: translateY(-2px);
}

.google-btn:active {
  transform: translateY(0);
}
.google-icon {
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E");
  background-size: cover;
  display: inline-block;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-form {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.toggle-form a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.toggle-form a:hover {
  color: var(--hover-accent);
  text-decoration: underline;
}

/* Animation classes */
.auth-container.animating .left-panel,
.auth-container.animating .right-panel {
  animation: fadeIn 0.5s ease-out;
}

.auth-container.animating .left-panel > *,
.auth-container.animating .right-panel form > * {
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.auth-container.animating .left-panel > *:nth-child(1) {
  animation-delay: 0.1s;
}
.auth-container.animating .left-panel > *:nth-child(2) {
  animation-delay: 0.2s;
}
.auth-container.animating .left-panel > *:nth-child(3) {
  animation-delay: 0.3s;
}
.auth-container.animating .left-panel > *:nth-child(4) {
  animation-delay: 0.4s;
}

.auth-container.animating .right-panel form > *:nth-child(1) {
  animation-delay: 0.1s;
}
.auth-container.animating .right-panel form > *:nth-child(2) {
  animation-delay: 0.2s;
}
.auth-container.animating .right-panel form > *:nth-child(3) {
  animation-delay: 0.3s;
}
.auth-container.animating .right-panel form > *:nth-child(4) {
  animation-delay: 0.4s;
}
.auth-container.animating .right-panel form > *:nth-child(5) {
  animation-delay: 0.5s;
}
.auth-container.animating .right-panel form > *:nth-child(6) {
  animation-delay: 0.6s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure animations play when switching between login and signup */
.auth-container.animating .left-panel,
.auth-container.animating .left-panel *,
.auth-container.animating .right-panel form,
.auth-container.animating .right-panel form * {
  animation-play-state: running !important;
}

/* Hide form during animation to prevent glitch */
.auth-container.animating .right-panel form {
  opacity: 0;
}

/* Show form after animation completes */
.auth-container:not(.animating) .right-panel form {
  opacity: 1;
  transition: opacity 0.3s ease-in;
}

</style>