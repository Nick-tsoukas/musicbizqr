<template>
  <div>
    <h1>Signup Success</h1>
    <p v-if="loading">Creating your account...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Account Created! Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSignup } from '~/composables/useSignup'

const route = useRoute()
const router = useRouter()
const { confirmPayment, loginUser } = useSignup()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const sessionId = route.query.session_id
    if (!sessionId) {
      error.value = "No session_id found."
      loading.value = false
      return
    }

    // Get user data from localStorage
    const email = localStorage.getItem('signup_email')
    const password = localStorage.getItem('signup_password')
    const name = localStorage.getItem('signup_name')

    if (!email || !password || !name) {
      error.value = "Missing signup info."
      loading.value = false
      return
    }

    // 1) Confirm Payment (and create user in Strapi)
    const strapiUser = await confirmPayment(sessionId as string, email, password, name)
    if (!strapiUser) {
      error.value = "User creation failed."
      loading.value = false
      return
    }

    // 2) Now login the user in Strapi to get JWT
    const loginResponse = await loginUser(email, password)
    // e.g. { jwt, user }

    // 3) Store JWT in a cookie or localStorage as needed
    const jwt = loginResponse.jwt
    // example store in a cookie or Pinia state
    localStorage.setItem('jwt', jwt)

    // 4) Clear sensitive info from localStorage
    localStorage.removeItem('signup_email')
    localStorage.removeItem('signup_password')
    localStorage.removeItem('signup_name')

    // 5) Redirect the user to a dashboard or welcome page
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || "Error creating account."
  } finally {
    loading.value = false
  }
})
</script>
