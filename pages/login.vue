<script setup>
import { useRuntimeConfig } from "#imports";
import { useFirebase } from "@/composables/useFirebase";
const { loginWithGoogle } = useFirebase();
import { ref } from "vue";

const { register, login } = useStrapiAuth();
const router = useRouter();

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

// Get Strapi Base URL from runtime config
const config = useRuntimeConfig();
const strapiBaseUrl = config.public.strapiUrl;

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    console.error("[Google Login Error]", err);
    alert("Something went wrong signing in with Google");
  }
};

const loginUser = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await login({ identifier: values.email, password: values.password });
    // Keep loading true - will navigate away
    await router.push("/dashboard");
  } catch (error) {
    console.log(error);
    errorMessage.value = "Invalid email or password. Please try again.";
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col pt-[var(--header-height)]">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <span class="text-white/70 text-sm">Signing you in...</span>
      </div>
    </div>

    <!-- Main Content - Full viewport on mobile -->
    <div class="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
      <div class="w-full max-w-md">
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/25 mb-4">
            <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p class="text-white/60 text-sm md:text-base">Sign in to your MusicBizQR account</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-red-400 text-sm flex items-center gap-2">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </p>
          </div>

          <!-- Email Field -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-white/70 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                class="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition text-base autofill-fix"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-white/70 mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                v-bind="passwordAttrs"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-12 py-3.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition text-base autofill-fix"
                placeholder="Enter your password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.975 9.975 0 012.187-3.368m3.048-2.634A9.935 9.935 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.271 5.145M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex justify-end mb-6">
            <NuxtLink to="/forgot-password" class="text-sm text-purple-400 hover:text-purple-300 transition">
              Forgot your password?
            </NuxtLink>
          </div>

          <!-- Login Button -->
          <button
            @click="loginUser"
            :disabled="loading"
            class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-purple-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Sign In
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-black text-white/40">or continue with</span>
            </div>
          </div>

          <!-- Google Login -->
          <button
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <img src="@/assets/google-icon.png" alt="Google" class="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <!-- Sign Up Link -->
        <p class="text-center mt-8 text-white/60">
          Don't have an account?
          <NuxtLink to="/signup" class="text-purple-400 hover:text-purple-300 font-medium transition">
            Sign up free
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure full viewport coverage on mobile */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100dvh;
  }
}

/* Fix browser autofill styling */
.autofill-fix:-webkit-autofill,
.autofill-fix:-webkit-autofill:hover,
.autofill-fix:-webkit-autofill:focus,
.autofill-fix:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #171717 inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
