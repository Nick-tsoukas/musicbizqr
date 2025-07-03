<script setup>
import { useRuntimeConfig } from '#imports';
import { ref } from 'vue';

const { register, login } = useStrapiAuth();
const router = useRouter();

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

// Get Strapi Base URL from runtime config
const config = useRuntimeConfig();
const strapiBaseUrl = config.public.strapiUrl;

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
  window.location.href = `${strapiBaseUrl}/api/connect/${provider}`;
};
</script>

<template>
  <div class="flex justify-center items-center w-screen pt-[var(--header-height)] custom_height">
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
        </div>

        <!-- Password input with toggle -->
        <div class="mdc-text-field mdc-text-field--filled mb-8 relative">
          <input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            :type="showPassword ? 'text' : 'password'"
            class="mdc-text-field__input pr-10"
            placeholder="Enter your password"
          />
          <label for="password" class="mdc-floating-label">Password</label>
          <span class="mdc-line-ripple"></span>

          <!-- Toggle show/hide password button -->
          <button
            type="button"
            class="absolute right-4 top-4 text-gray-500 focus:outline-none"
            @click="showPassword = !showPassword"
          >
            <!-- Eye Icon -->
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <!-- Eye Off Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.975 9.975 0 012.187-3.368m3.048-2.634A9.935 9.935 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.271 5.145M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
</svg>

          </button>
        </div>

        <!-- Login button -->
        <div>
          <button @click="loginUser" class="mdc-button mdc-button--raised w-full mb-4">
            Login
          </button>
          <p class="text-center">
            Need an account?
            <NuxtLink to="/signup" class="text-underline text-blue-800">SIGN UP</NuxtLink>
          </p>
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
  color: #f56565;
}

button svg {
  transition: color 0.2s;
}
button:hover svg {
  color: #7c3aed; /* Purple-600 on hover */
}
</style>
