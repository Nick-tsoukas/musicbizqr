<template>
  <div>
    <h1 class="text-white">Signup Success</h1>
    <p class="text-white" v-if="loading">Creating your account...</p>
    <p class="text-white" v-else-if="error">{{ error }}</p>
    <p class="text-white" v-else>Account Created! Redirecting...</p>
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
console.log('creating account this is onmounted hook ')
  try {
    const sessionId = route.query.session_id
    console.log('this is session id' , route.query.session_id)
    if (!sessionId) {
      error.value = "No session_id found."
      console.log(error.value)
      loading.value = false
      return
    }

    // Get user data from localStorage
    const email = localStorage.getItem('signup_email')
    const password = localStorage.getItem('signup_password')
    const name = localStorage.getItem('signup_name')
    console.log(email, password, name, 'this is the localstorage data still in onmontued hook') 
    if (!email || !password || !name) {
      error.value = "Missing signup info."
      console.log(error.value)
      loading.value = false
      return
    }
    console.log('About to call confirmPayment with:', sessionId, email, password, name);

    // 1) Confirm Payment (and create user in Strapi)
    const strapiUser = await confirmPayment(sessionId as string, email, password, name)
    console.log(strapiUser, 'is there a strapi user ')
    if (!strapiUser) {
      console.log('this is the errror when creating strapi user if!strapi user ')

      error.value = "User creation failed."
      console.log(error.value)
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
    console.log('there is an error this is the catch statment ', err)
  } finally {
    loading.value = false
  }
})
</script>
