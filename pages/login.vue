<script setup>

import { useRuntimeConfig } from '#imports';
import { ref } from 'vue';


const { register, login } = useStrapiAuth();
const router = useRouter();

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const loading = ref(false);
const errorMessage = ref(''); // Ref to store the error message

// Get Strapi Base URL from runtime config
const config = useRuntimeConfig();
const strapiBaseUrl = config.public.strapiUrl; // Ensure this is set in nuxt.config.js

const signUp = async () => {
  try {
    await register({ username: values.email, email: values.email, password: values.password });
    router.push('/dashboard');
  } catch (e) {
    console.log('There was an error');
  }
};

const loginUser = async () => {
  loading.value = true;

  try {
    await login({ identifier: values.email, password: values.password });
    router.push('/dashboard');
    loading.value = false;
  } catch (error) {
    console.log(error);
    errorMessage.value = 'Invalid email or password. Please try again.';
    loading.value = false;
  }
};

const loginWithProvider = (provider) => {
  // Redirect to the Strapi provider endpoint
  window.location.href = `${strapiBaseUrl}/api/connect/${provider}`;
};
</script>

<template>
  <div class="flex justify-center items-center w-screen custom_height">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class="container-mdc">
      <div class="bg-white p-8 rounded-sm">
        <div>
          <h2 class="text-xl mb-6 text-black font-semibold">Login</h2>
        </div>

        <!-- Display error message if it exists -->
        <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>

        <!-- Email input -->
        <div class="mdc-text-field mdc-text-field--filled mb-4">
          <input
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="text"
            class="mdc-text-field__input"
            placeholder="Enter your email"
          />
          <label for="email" class="mdc-floating-label">Email</label>
          <span class="mdc-line-ripple"></span>
          <!-- Optional clear form functionality -->
          <!-- <img src="@/assets/cancel-icon.svg" alt="Cancel Icon" class="cancel-icon" @click="clearForm" /> -->
        </div>

        <!-- Password input -->
        <div class="mdc-text-field mdc-text-field--filled mb-8">
          <input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            class="mdc-text-field__input"
            placeholder="Enter your password"
          />
          <label for="password" class="mdc-floating-label">Password</label>
          <span class="mdc-line-ripple"></span>
          <!-- Optional clear form functionality -->
          <!-- <img src="@/assets/cancel-icon.svg" alt="Cancel Icon" class="cancel-icon" @click="clearForm" /> -->
        </div>

        <!-- Login button -->
        <div>
          <button @click="loginUser" class="mdc-button mdc-button--raised w-full mb-4">
            Login
          </button>
          <p class="text-right">
            Need an account?
            <NuxtLink to="/signup" class="text-underline text-blue-800">SIGN UP</NuxtLink>
          </p>
        </div>

        <!-- Social login buttons -->
        <div class="mt-4">
          <button @click="loginWithProvider('google')" class="mdc-button mdc-button--raised w-full mb-2">
            Login with Google
          </button>
          <button @click="loginWithProvider('facebook')" class="mdc-button mdc-button--raised w-full">
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom_height {
  height: calc(100vh - 89px);
}

.text-red-500 {
  color: #f56565; /* Tailwind red for error message */
}
</style>
