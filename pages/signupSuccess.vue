<template>
  <div>
    <h1 class="text-white">Signup Success</h1>
    <p v-if="loading" class="text-white">Creating your account...</p>
    <p v-else-if="error" class="text-white">{{ error }}</p>
    <p v-else class="text-white">{{ successMessage }}</p>
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
