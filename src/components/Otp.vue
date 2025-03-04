<template>
  <div class="otp-container">
    <div class="otp-card">
      <h2 class="otp-title">Enter Verification Code</h2>
      <p class="otp-subtitle">
        Please enter the 6-digit code sent to your email
      </p>

      <div class="otp-input-group">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          type="text"
          maxlength="1"
          :ref="(el) => (inputRefs[index] = el)"
          @input="handleInput(index)"
          @keydown="handleKeydown($event, index)"
          @paste="handlePaste"
          class="otp-digit"
        />
      </div>

      <button
        class="verify-button"
        :disabled="isVerifying || !isComplete"
        @click="verifyOTP"
      >
        {{ isVerifying ? "Verifying..." : "Verify Code" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();
const otpDigits = ref<string[]>(Array(6).fill(""));
const inputRefs = ref<HTMLInputElement[]>([]);
const isVerifying = ref(false);

const isComplete = computed(() => {
  return otpDigits.value.every((digit) => digit !== "");
});

const handleInput = (index: number) => {
  const value = otpDigits.value[index];
  // Only allow digits
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = "";
    return;
  }

  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === "Backspace" && !otpDigits.value[index]) {
    if (index > 0) {
      inputRefs.value[index - 1]?.focus();
    }
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text");
  if (!pastedData) return;

  const digits = pastedData.slice(0, 6).split("");
  digits.forEach((digit, index) => {
    if (/^\d$/.test(digit)) {
      otpDigits.value[index] = digit;
    }
  });
};

const verifyOTP = async () => {
  const otp = otpDigits.value.join("");
  const id = route.params.id as string;

  if (!id) {
    toast.error("Invalid verification link", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "colored",
    });
    return;
  }

  isVerifying.value = true;

  try {
    const response = await fetch("https://high-goose-81-7wg96m812d17.deno.dev/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp,
        id,
      }),
      credentials: "include",
    });

    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Verification failed";

      try {
        // Try to parse as JSON first
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // If not JSON, use the raw text
        errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    // Parse the response as JSON
    const result = await response.json();

    // Check the message property
    if (result.message === "SignUpSuccessLoginned") {
      toast.success("Verification successful!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
      });

      // Store both userId and token in localStorage
      if (result.userId) {
        localStorage.setItem("userId", result.userId);
      }

      // Store the JWT token for authentication
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Redirect to home or dashboard
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Verification failed",
      {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
      }
    );
    otpDigits.value = Array(6).fill("");
    inputRefs.value[0]?.focus();
  } finally {
    isVerifying.value = false;
  }
};

onMounted(() => {
  // Focus first input on mount
  inputRefs.value[0]?.focus();

  // Validate if ID exists in URL
  if (!route.params.id) {
    toast.error("Invalid verification link", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "colored",
    });
    router.push("/");
  }
});
</script>

<style scoped>
.otp-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-bg);
  padding: 1rem;
}

.otp-card {
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.otp-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.otp-subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: var(--font-size-base);
}

.otp-input-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.otp-digit {
  width: 50px;
  height: 50px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  text-align: center;
  font-size: 1.25rem;
  color: var(--text-primary);
  background-color: var(--secondary-bg);
  transition: border-color 0.2s;
}

.otp-digit:focus {
  border-color: var(--accent-color);
  outline: none;
}

.verify-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent-color);
  color: var(--common-white);
  border: none;
  border-radius: 6px;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background-color 0.2s;
}

.verify-button:hover:not(:disabled) {
  background-color: var(--hover-accent);
}

.verify-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
