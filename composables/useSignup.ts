// ~/composables/useSignup.ts
import { useFetch, useRuntimeConfig  } from '#app'

export function useSignup() {
  const config      = useRuntimeConfig()
  const strapiBase  = config.public.strapiUrl || ''

  /**
   *  Register a new user with a 30-day trial
   */
  async function registerUser(name: string, email: string, password: string) {
    const url     = `${strapiBase}/api/stripe/register`
    const payload = { name, email, password }

    // 🔍 Log exactly what we’re sending
    console.log('[registerUser] POST →', url, payload)

    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    const data = await res.json()

    // 🔍 Log the raw response
    console.log('[registerUser] RESP ←', data)

    if (!res.ok) {
      // Strapi will set data.message on errors
      throw new Error(data?.message || 'Registration failed')
    }

    // data.user should be { id, email }
    return data.user
  }

  return { registerUser }
}
