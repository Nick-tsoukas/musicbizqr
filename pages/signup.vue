<template>
  <div class="flex justify-center items-center w-screen pt-[var(--header-height)] custom_height">
    <!-- Loading Spinner (if needed) -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div class="container-mdc">
      <div class="bg-white p-8 rounded-sm">
        <div>
          <h2 class="text-xl mb-6 text-black font-semibold">Sign Up</h2>
        </div>

        <!-- Display error message if it exists -->
        <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>

        <!-- Sign Up Form -->
        <form @submit.prevent="handleSignup">
          <!-- Name input -->
          <div class="mdc-text-field mdc-text-field--filled mb-4">
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="mdc-text-field__input"
              placeholder="Enter your name"
            />
            <label for="name" class="mdc-floating-label">Name</label>
            <span class="mdc-line-ripple"></span>
          </div>

          <!-- Email input -->
          <div class="mdc-text-field mdc-text-field--filled mb-4">
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="mdc-text-field__input"
              placeholder="Enter your email"
            />
            <label for="email" class="mdc-floating-label">Email</label>
            <span class="mdc-line-ripple"></span>
          </div>

          <!-- Password input -->
          <div class="mdc-text-field mdc-text-field--filled mb-8">
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="mdc-text-field__input"
              placeholder="Enter your password"
            />
            <label for="password" class="mdc-floating-label">Password</label>
            <span class="mdc-line-ripple"></span>
          </div>

          <!-- Sign Up button -->
          <div>
            <button type="submit" class="mdc-button mdc-button--raised w-full mb-4">
              Sign Up
            </button>
          </div>
        </form>

        <!-- Already have an account? -->
        <p class="text-right">
          Already have an account?
          <NuxtLink to="/login" class="text-underline text-blue-800">Login</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useSignup } from '~/composables/useSignup'
const router       = useRouter()

const { registerUser } = useSignup()
const loading      = ref(false)
const errorMessage = ref('')

const formData = ref({
  name: '',
  email: '',
  password: '',
})

const handleSignup = async () => {
  loading.value = true
  errorMessage.value = ''
  console.log('[handleSignup] payload →', JSON.stringify(formData.value))

  try {
    // 1️⃣ Register user & start 30-day trial in one call
    const user = await registerUser(
      formData.value.name,
      formData.value.email,
      formData.value.password
    )

    // 2️⃣ Notify & navigate
    alert(`✅ Welcome ${user.email}! Your 30-day trial is now active.`)
    router.push('/signupSuccess')
  } catch (err: any) {
    console.error('Signup failed', err)
    errorMessage.value = err.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
