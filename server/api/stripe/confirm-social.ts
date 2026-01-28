import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'
import { createStripeCustomerAndTrial } from '~/server/utils/stripe-trial'

type StrapiUser = {
  id: number
  username: string
  email: string
  customerId?: string
  subscriptionId?: string
  subscriptionStatus?: string
  confirmed: boolean
}

export default defineEventHandler(async (event) => {
  try {
    const { email, name, uid } = await readBody(event)

    if (!email || !name) {
      return {
        statusCode: 400,
        body: { error: 'Missing email or name' }
      }
    }

    const config = useRuntimeConfig()
    const strapiUrl = config.public.strapiUrl

    // Use UID to generate a reproducible password
    const password = uid + '_firebaseA1!'
    
    // Use email as username to avoid conflicts with display names containing spaces
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now().toString(36)

  // Step 1: Check if user already exists (requires API token for user lookup)
  const apiToken = config.strapiApiToken
  if (!apiToken) {
    console.error('[confirm-social] STRAPI_API_TOKEN not configured')
    throw new Error('Server configuration error - missing API token')
  }
  
  // Use custom user-admin endpoint that works with API tokens
  console.log('[confirm-social] Checking for existing user:', email)
  console.log('[confirm-social] Strapi URL:', strapiUrl)
  console.log('[confirm-social] API Token present:', !!apiToken, 'length:', apiToken?.length)
  
  let existingUsers: StrapiUser[] = []
  try {
    existingUsers = await $fetch<StrapiUser[]>(`${strapiUrl}/api/user-admin/by-email/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
    console.log('[confirm-social] User lookup result:', existingUsers?.length || 0, 'users found')
  } catch (lookupError: any) {
    console.error('[confirm-social] User lookup failed:', lookupError?.message)
    console.error('[confirm-social] Lookup status:', lookupError?.status || lookupError?.statusCode)
    throw new Error(`User lookup failed: ${lookupError?.message}`)
  }

  let user: StrapiUser
  let jwt: string

  if (existingUsers.length > 0) {
    user = existingUsers[0]
    console.log('[confirm-social] Existing user found:', user.id, user.email)

    // For existing users, try password login first
    try {
      const loginRes = await $fetch<{ jwt: string }>(`${strapiUrl}/api/auth/local`, {
        method: 'POST',
        body: {
          identifier: email,
          password
        }
      })
      jwt = loginRes.jwt
      console.log('[confirm-social] Password login succeeded for existing user')
    } catch (loginError: any) {
      console.log('[confirm-social] Password login failed, updating password for Google auth')
      
      // Update user's password using custom user-admin endpoint (works with API tokens)
      await $fetch(`${strapiUrl}/api/user-admin/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiToken}`
        },
        body: {
          password,
          confirmed: true,
          provider: 'local'
        }
      })

      // Now login should work
      const loginRes = await $fetch<{ jwt: string }>(`${strapiUrl}/api/auth/local`, {
        method: 'POST',
        body: {
          identifier: email,
          password
        }
      })
      jwt = loginRes.jwt
      console.log('[confirm-social] Password login succeeded after update')
    }
    
    // For existing users, only create Stripe customer if they don't have one
    if (!user.customerId) {
      console.log('[confirm-social] Existing user has no Stripe customer, creating one')
      try {
        const customer = await createStripeCustomerAndTrial(user)
        await $fetch(`${strapiUrl}/api/user-admin/${user.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${apiToken}`
          },
          body: {
            customerId: customer.id,
            subscriptionId: customer.subscriptionId,
            subscriptionStatus: 'trialing',
            trialEndsAt: customer.trialEndsAt
          }
        })
        console.log('[confirm-social] Stripe customer created for existing user:', customer.id)
      } catch (stripeError: any) {
        console.error('[confirm-social] Stripe error for existing user:', stripeError?.message)
        // Don't fail login if Stripe fails for existing user - they can still use the app
      }
    } else {
      console.log('[confirm-social] Existing user already has Stripe customer:', user.customerId)
    }
    
    return {
      jwt,
      user: {
        ...user,
        customerId: user.customerId
      }
    }
  } else {
    // Register new user
    console.log('[confirm-social] Registering new user:', { email, username })
    
    let createRes: { jwt: string; user: StrapiUser }
    try {
      createRes = await $fetch<{ jwt: string; user: StrapiUser }>(`${strapiUrl}/api/auth/local/register`, {
        method: 'POST',
        body: {
          username,
          email,
          password,
          confirmed: true
        }
      })
      console.log('[confirm-social] User registered:', createRes.user?.id)
    } catch (registerError: any) {
      console.error('[confirm-social] Registration failed:', registerError?.message)
      console.error('[confirm-social] Registration error data:', registerError?.data)
      throw new Error(`Registration failed: ${registerError?.data?.error?.message || registerError?.message}`)
    }

    user = createRes.user
    jwt = createRes.jwt

    // Step 3: Create Stripe customer and start trial for NEW users only
    console.log('[confirm-social] Creating Stripe customer for new user')
    try {
      const customer = await createStripeCustomerAndTrial(user)

      // Step 4: Update Strapi user with Stripe data using custom endpoint
      await $fetch(`${strapiUrl}/api/user-admin/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiToken}`
        },
        body: {
          customerId: customer.id,
          subscriptionId: customer.subscriptionId,
          subscriptionStatus: 'trialing',
          trialEndsAt: customer.trialEndsAt
        }
      })
      console.log('[confirm-social] New user Stripe setup complete:', customer.id)

      return {
        jwt,
        user: {
          ...user,
          customerId: customer.id
        }
      }
    } catch (stripeError: any) {
      console.error('[confirm-social] Stripe setup failed for new user:', stripeError?.message)
      // Return the user anyway - they're registered, just without Stripe
      // They can set up billing later
      return {
        jwt,
        user: {
          ...user,
          customerId: null
        }
      }
    }
  }
  } catch (error: any) {
    console.error('[confirm-social] Error:', error?.message || error)
    console.error('[confirm-social] Stack:', error?.stack)
    throw error
  }
})
