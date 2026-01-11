<template>
  <div class="min-h-screen bg-black flex flex-col pt-[var(--header-height)]">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <span class="text-white/70 text-sm">Creating your account...</span>
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
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p class="text-white/60 text-sm md:text-base">Start your 30-day free trial today</p>
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

          <form @submit.prevent="handleSignup">
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
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition text-base"
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
                  v-model="formData.password"
                  type="password"
                  required
                  minlength="6"
                  class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition text-base"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
            </div>

            <!-- Sign Up Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-purple-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Start Free Trial
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-black text-white/40">or continue with</span>
            </div>
          </div>

          <!-- Google Sign Up -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <img src="@/assets/google-icon.png" alt="Google" class="w-5 h-5" />
            Continue with Google
          </button>

          <!-- Trial Info -->
          <div class="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-white/80 text-sm font-medium">30-day free trial included</p>
                <p class="text-white/50 text-xs mt-1">No credit card required. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Login Link -->
        <p class="text-center mt-8 text-white/60">
          Already have an account?
          <NuxtLink to="/login" class="text-purple-400 hover:text-purple-300 font-medium transition">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSignup } from "~/composables/useSignup";

const { loginWithGoogle } = useFirebase();
const router = useRouter();
const { $fbq } = useNuxtApp(); // 👈 get fbq helper from plugin

const { registerUser } = useSignup();
const loading = ref(false);
const errorMessage = ref("");
const { trackWithStoredEventId } = useMetaTracking()

const formData = ref({
  email: "",
  password: "",
});

// prevent double tracking
const hasTrackedSignupStart = ref(false);

const trackSignupStarted = async () => {
  if (!process.client || hasTrackedSignupStart.value) return
  hasTrackedSignupStart.value = true

  // This fires pixel events AND stores a stable event_id in sessionStorage
  const eventId = trackWithStoredEventId({
    eventKey: 'signup_started',
    standardName: 'Lead',
    customName: 'SignupStarted',
    params: {
      content_name: 'SignupStarted',
      event_source: 'nuxt-frontend',
    },
    reuse: true,
  })

  // ✅ NEW: server-side CAPI (same event_id for dedupe)
  try {
    // UTMs already stored in sessionStorage by B.2;
    // we can include them as custom_data if you want.
    let utm = {}
    try { utm = JSON.parse(sessionStorage.getItem('mbq_utm') || '{}') } catch {}

    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'Lead',
        event_id: eventId,
        event_source_url: window.location.href,
        // Email is optional here (user typed it, but could be empty pre-submit)
        email: formData.value?.email || undefined,
        custom_data: {
          content_name: 'SignupStarted',
          ...utm,
        },
      }),
    })
  } catch (e) {
    // silent fail, don't break signup UX
  }
}


const handleGoogleLogin = async () => {
  try {
    // You could also call trackSignupStarted() here if you want to count Google starts
    await loginWithGoogle(); // all logic handled inside
  } catch (err) {
    console.error("[Google Signup Error]", err);
    alert("Something went wrong signing in with Google");
  }
};

const handleSignup = async () => {
  loading.value = true;
  errorMessage.value = "";
  console.log("[handleSignup] payload →", JSON.stringify(formData.value));

  try {
    // 1️⃣ Track SignupStarted (once)
    await trackSignupStarted();

    // 2️⃣ Default name = email
    const name = formData.value.email;

    // 3️⃣ Register user & start 30-day trial in one call
    const user = await registerUser(
      name,
      formData.value.email,
      formData.value.password
    );

    // 4️⃣ Notify & navigate
    alert(`✅ Welcome ${user.email}! Your 30-day trial is now active.`);
    router.push("/signupSuccess");
  } catch (err) {
    console.error("Signup failed", err);
    errorMessage.value = err.message || "Signup failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Ensure full viewport coverage on mobile */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100dvh;
  }
}
</style>
