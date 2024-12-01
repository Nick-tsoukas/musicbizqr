<template>
  <div class="flex justify-center items-center w-screen custom_height">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class="container-mdc" v-else>
      <div class="bg-white p-8 rounded-sm">
        <div>
          <h2 class="text-xl mb-6 text-black font-semibold">Sign Up</h2>
        </div>

        <!-- Display error message if it exists -->
        <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>

        <!-- Email input -->
        <div class="mdc-text-field mdc-text-field--filled mb-4">
          <input
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            class="mdc-text-field__input"
            placeholder="Enter your email"
            required
          />
          <label for="email" class="mdc-floating-label">Email</label>
          <span class="mdc-line-ripple"></span>
        </div>

        <!-- Password input -->
        <div class="mdc-text-field mdc-text-field--filled mb-8">
          <input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            class="mdc-text-field__input"
            placeholder="Create a password"
            required
          />
          <label for="password" class="mdc-floating-label">Password</label>
          <span class="mdc-line-ripple"></span>
        </div>

        <!-- Stripe Card Element -->
        <div class="mb-8">
          <label for="card-element" class="block text-gray-700">Credit or Debit Card</label>
          <div id="card-element" class="p-4 border border-gray-300 rounded"></div>
        </div>

        <!-- Sign Up button -->
        <div>
          <button @click="signUp" class="mdc-button mdc-button--raised w-full mb-4">
            Sign Up
          </button>
          <p class="text-right">
            Already have an account?
            <NuxtLink to="/login" class="text-underline text-blue-800">LOGIN</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';


// Use useClientStripe from the module
const { stripe, isLoading } = useClientStripe();

const { register } = useStrapiAuth();
const router = useRouter();

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const elements = ref(null);
const cardElement = ref(null);
const errorMessage = ref('');
const loading = ref(false);

watch(
  stripe,
  () => {
    if (stripe.value) {
      // Initialize Stripe Elements
      elements.value = stripe.value.elements();
      cardElement.value = elements.value.create('card');
      cardElement.value.mount('#card-element');
    }
  },
  { immediate: true }
);

const signUp = async () => {
  loading.value = true;
  try {
    // Create payment method
    const { error, paymentMethod } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: cardElement.value,
      billing_details: {
        email: email.value,
      },
    });

    if (error) {
      errorMessage.value = error.message;
      loading.value = false;
      return;
    }

    // Create subscription on the server
    const subscriptionResponse = await $fetch('/api/create-subscription', {
      method: 'POST',
      body: {
        email: email.value,
        paymentMethodId: paymentMethod.id,
      },
    });

    const { subscription } = subscriptionResponse;

    // Register the user in Strapi with subscription info
    await register({
      username: email.value,
      email: email.value,
      password: password.value,
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      subscriptionStatus: subscription.status,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    });

    router.push('/dashboard');
  } catch (e) {
    console.error('Registration error:', e);
    errorMessage.value = 'An error occurred during registration.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom_height {
  height: calc(100vh - 89px);
}

.text-red-500 {
  color: #f56565; /* Tailwind red for error message */
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #6200ee; /* Purple */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mdc-text-field__input {
  padding: 0.75rem;
  border: 1px solid #000;
  border-radius: 4px;
  width: 100%;
}

.mdc-button {
  background-color: #6200ee;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
}

.mdc-button:hover {
  background-color: #3700b3;
}
</style>
