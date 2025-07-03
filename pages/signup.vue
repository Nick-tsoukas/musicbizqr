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

const { createStripeCustomer, createCheckoutSession } = useSignup()

const formData = ref({
  name: '',
  email: '',
  password: '',
})

const handleSignup = async () => {
  try {
    // 1) Create a Stripe Customer
    const customerId = await createStripeCustomer(formData.value.email, formData.value.name)

    // 2) Create Checkout Session
    const checkoutUrl = await createCheckoutSession(customerId)

    // 3) Temporarily store the user data so we can use it after redirect
    sessionStorage.setItem('signup_email', formData.value.email)
sessionStorage.setItem('signup_password', formData.value.password)
sessionStorage.setItem('signup_name', formData.value.name)
    // 4) Redirect to Stripe
    window.location.href = checkoutUrl
  } catch (err) {
    console.error(err)
    alert('Signup failed')
  }
}
</script>
