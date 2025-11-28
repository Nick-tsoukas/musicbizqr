<script setup lang="ts">
import { ref } from "vue";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const strapiBaseUrl = config.public.strapiUrl;

const email = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const submitForgotPassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  if (!email.value) {
    errorMessage.value = "Please enter your email.";
    return;
  }

  loading.value = true;
  try {
    await $fetch(`${strapiBaseUrl}/api/auth/forgot-password`, {
      method: "POST",
      body: { email: email.value },
    });

    successMessage.value =
      "If an account exists for that email, we’ve sent a reset link.";
  } catch (err: any) {
    console.error("[forgot-password]", err);
    // Don’t leak details – just give a generic message
    errorMessage.value =
      "We couldn’t send the reset email. Please check the address and try again.";
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
        <h2 class="text-xl mb-4 text-black font-semibold">Reset your password</h2>
        <p class="text-sm text-gray-700 mb-6">
          Enter the email you use for MusicBizQR and we’ll send you a link to
          create a new password.
        </p>

        <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-600 mb-4">
          {{ successMessage }}
        </p>

        <div class="mdc-text-field mdc-text-field--filled mb-6 w-full">
          <input
            id="email"
            v-model="email"
            type="email"
            class="mdc-text-field__input"
            placeholder="you@example.com"
          />
          <label for="email" class="mdc-floating-label">Email</label>
          <span class="mdc-line-ripple"></span>
        </div>

        <button
          @click="submitForgotPassword"
          class="mdc-button mdc-button--raised w-full mb-3"
          :disabled="loading"
        >
          <span v-if="!loading">Send reset link</span>
          <span v-else>Sending…</span>
        </button>

        <p class="text-center text-sm text-gray-600 mt-2">
          Remembered it?
          <NuxtLink to="/login" class="text-blue-800 underline">
            Back to login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
  <!-- this is a push to git  -->
</template>

<style scoped>
.custom_height {
  height: calc(100vh - 89px);
}
</style>
