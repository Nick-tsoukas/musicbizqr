// ~/composables/useSignup.ts
import { useFetch, useRuntimeConfig  } from '#app'

export function useSignup() {
    const config = useRuntimeConfig()
  
    // 2) Use the public strapiUrl from nuxt.config.ts
    const strapiBaseURL = config.public.strapiUrl

  // 1) Create Stripe Customer
  const createStripeCustomer = async (email: string, name: string) => {
    console.log('creating customer ')
    const { data, error } = await useFetch('/api/stripe/create-customer', {
      baseURL: strapiBaseURL,
      method: 'POST',
      body: { email, name },
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Error creating Stripe Customer')
    }
    return data.value?.customerId
  }

  // 2) Create Checkout Session
  const createCheckoutSession = async (customerId: string) => {
    console.log('creating checkout session')
    const { data, error } = await useFetch('/api/stripe/create-checkout-session', {
      baseURL: strapiBaseURL,
      method: 'POST',
      body: { customerId },
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Error creating Checkout Session')
    }
    return data.value?.url
  }

  // 3) Confirm Payment / Create User in Strapi
  const confirmPayment = async (sessionId: string, email: string, password: string, name: string) => {
    console.log('confirmpayment ', sessionId,email, password , ' this is the data ' )
    const { data, error } = await useFetch('/api/stripe/confirm-payment', {
      baseURL: strapiBaseURL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId, email, password, name }),
    })
  
    if (error.value) {
      console.error('STRIPE CONFIRM PAYMENT ERROR:', error.value.data)
      throw new Error(error.value.data?.message ?? JSON.stringify(error.value.data))
    }
    return data.value?.user
  }
  
  console.log('no error in the post to confirm payment yet ')

  // 4) Login User in Strapi
  const loginUser = async (email: string, password: string) => {
    console.log('login users .... have we created user yet  ')
    // Strapi default local auth: /api/auth/local
    const { data, error } = await useFetch('/api/auth/local', {
      baseURL: strapiBaseURL,
      method: 'POST',
      body: {
        identifier: email,
        password: password,
      },
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Error logging in user')
    }
    // returns { jwt, user } typically
    return data.value
  }

  return {
    createStripeCustomer,
    createCheckoutSession,
    confirmPayment,
    loginUser,
  }
}
