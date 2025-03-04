<!-- Login.vue -->
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
  router.push("/signup");
};

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Update the handleLogin function in Login.vue
const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error("Both email and password are required", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch("https://high-goose-81-0qpzy7b8csjh.deno.dev/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      credentials: "include", // Keep this to allow CORS with credentials
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const result = await response.json();

    if (result.message === "LoginSuccess") {
      // Store token in localStorage for frontend auth
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }
      
      // Store userId in localStorage
      if (result.userId) {
        localStorage.setItem("userId", result.userId);
      }

      toast.success("Login successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  } catch (error) {
    let errorMessage = "An error occurred during login";

    if (error.message.includes("User does not exist")) {
      errorMessage = "User does not exist";
    } else if (error.message.includes("Invalid password")) {
      errorMessage = "Invalid password";
    }

    toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container" :class="{ animating: isAnimating }">
    <div class="left-panel" :class="{ login: true }">
      <div class="logo"></div>
      <h1>Aether Cure</h1>
      <p>
        Access personalized health predictions powered by AI and blockchain.
      </p>
      <div class="fact-box" :class="{ login: true }">
        <h3>Did You Know?</h3>
        <p>
          AI can predict cardiovascular issues with 80% accuracy using retinal
          scans.
        </p>
      </div>
    </div>
    <div class="right-panel">
      <form @submit.prevent="handleLogin" :style="formStyle">
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
          <span v-if="!isLoading">Log In</span>
          <span v-else class="spinner"></span>
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
body {
  background-color: var(--main-bg);
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  display: flex;
  background-color: var(--secondary-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 900px;
  height: auto;
  min-height: 600px;
  overflow: hidden;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
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
  width: 100%;
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

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Update submit button styles to center the spinner */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px; /* Ensure consistent height */
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    height: auto;
    max-height: none;
    width: 95%;
    margin: 15px auto;
    min-height: auto;
  }
  
  .left-panel {
    display: none; /* Hide the left panel on mobile */
  }
  
  .right-panel {
    width: 100%;
    padding: 25px;
  }
  
  form {
    padding: 15px 0;
  }
  
  h2 {
    text-align: center;
  }
  
  form > p {
    text-align: center;
  }
}

/* Small tablet and large phones */
@media (min-width: 769px) and (max-width: 991px) {
  .auth-container {
    width: 90%;
    max-width: 700px;
  }
  
  .left-panel {
    padding: 30px;
  }
  
  .right-panel {
    padding: 30px;
  }
}
</style>