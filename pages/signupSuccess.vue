<template>
  <!-- Full-screen dark background, center everything -->
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-md shadow-md p-8">
      <!-- Loading State -->
      <template v-if="loading">
        <h1 class="text-xl font-semibold text-gray-800 mb-2">Creating your account...</h1>
        <p class="text-gray-600">Please wait while we finalize your account setup.</p>
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <h1 class="text-xl font-semibold text-red-600 mb-2">Signup Error</h1>
        <p class="text-gray-600">
          {{ error }}
        </p>
      </template>

      <!-- Success State -->
      <template v-else>
        <h1 class="text-xl font-semibold text-gray-800 mb-2">Signup Success</h1>
        <p class="text-gray-600 mb-4">
          {{ successMessage }}
        </p>
        <p class="text-gray-600">
          Please check your email for the confirmation link to activate your account.
        </p>
      </template>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSignup } from '~/composables/useSignup'

const route = useRoute()
const { confirmPayment } = useSignup()

const loading = ref(true)
const error = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const sessionId = route.query.session_id
    if (!sessionId) {
      error.value = "No session_id found."
      loading.value = false
      return
    }

    // Get user data from sessionStorage
    const email = sessionStorage.getItem('signup_email')
    const password = sessionStorage.getItem('signup_password')
    const name = sessionStorage.getItem('signup_name')

    if (!email || !password || !name) {
      error.value = "Missing signup info."
      loading.value = false
      return
    }

    console.log('About to call confirmPayment with:', sessionId, email, password, name);
    // Call confirmPayment; this endpoint should now send the confirmation email.
    const response = await confirmPayment(sessionId as string, email, password, name)
    
    // Expect response to be an object with a "message" field.
    successMessage.value = response.message || "A confirmation email has been sent. Please check your inbox to confirm your account."

    // Clear sensitive info from sessionStorage
    sessionStorage.removeItem('signup_email')
    sessionStorage.removeItem('signup_password')
    sessionStorage.removeItem('signup_name')
  } catch (err: any) {
    error.value = err.message || "Error creating account."
    console.error('Error in catch:', error.value)
  } finally {
    loading.value = false
  }
})
</script>
