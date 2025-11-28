<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter, useRuntimeConfig } from "#imports";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const strapiBaseUrl = config.public.strapiUrl;

const code = computed(() => route.query.code as string | undefined);

const password = ref("");
const passwordConfirmation = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const submitResetPassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!code.value) {
    errorMessage.value =
      "Invalid or missing reset code. Please use the link from your email.";
    return;
  }

  if (!password.value || !passwordConfirmation.value) {
    errorMessage.value = "Please fill out both password fields.";
    return;
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  try {
    await $fetch(`${strapiBaseUrl}/api/auth/reset-password`, {
      method: "POST",
      body: {
        code: code.value,
        password: password.value,
        passwordConfirmation: passwordConfirmation.value,
      },
    });

    successMessage.value = "Your password has been reset successfully.";
    // after a short delay, send them to login
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (err: any) {
    console.error("[reset-password]", err);
    errorMessage.value =
      "We couldn’t reset your password. The link may have expired or been used already.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex justify-center items-center w-screen pt-[var(--header-height)] custom_height"
  >
    <div class="container-mdc">
      <div class="bg-white p-8 rounded-sm max-w-md mx-auto">
        <h2 class="text-xl mb-4 text-black font-semibold">Choose a new password</h2>

        <p v-if="!code" class="text-red-500 mb-4">
          Missing reset code. Please use the reset link from your email.
        </p>

        <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-600 mb-4">
          {{ successMessage }}
        </p>

        <!-- New password -->
        <div class="mdc-text-field mdc-text-field--filled mb-4 w-full">
          <input
            id="password"
            v-model="password"
            type="password"
            class="mdc-text-field__input"
            placeholder="New password"
          />
          <label for="password" class="mdc-floating-label">New password</label>
          <span class="mdc-line-ripple"></span>
        </div>

        <!-- Confirm password -->
        <div class="mdc-text-field mdc-text-field--filled mb-6 w-full">
          <input
            id="passwordConfirmation"
            v-model="passwordConfirmation"
            type="password"
            class="mdc-text-field__input"
            placeholder="Confirm new password"
          />
          <label for="passwordConfirmation" class="mdc-floating-label">
            Confirm new password
          </label>
          <span class="mdc-line-ripple"></span>
        </div>

        <button
          @click="submitResetPassword"
          class="mdc-button mdc-button--raised w-full mb-3"
          :disabled="loading || !code"
        >
          <span v-if="!loading">Reset password</span>
          <span v-else>Resetting…</span>
        </button>

        <p class="text-center text-sm text-gray-600 mt-2">
          Back to
          <NuxtLink to="/login" class="text-blue-800 underline">
            Login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom_height {
  height: calc(100vh - 89px);
}
</style>
