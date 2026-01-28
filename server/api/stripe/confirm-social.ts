import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'
import { v4 as uuidv4 } from 'uuid'
import { createStripeCustomerAndTrial } from '~/server/utils/stripe-trial'

type StrapiUser = {
  id: number
  username: string
  email: string
  customerId?: string
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
  const existingUsers = await $fetch<StrapiUser[]>(`${strapiUrl}/api/user-admin/by-email/${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  })

  let user: StrapiUser
  let jwt: string

  if (existingUsers.length > 0) {
    user = existingUsers[0]

    // For existing users, try password login first (for Google-created accounts)
    // If that fails, update their password to the Firebase-derived one and retry
    try {
      const loginRes = await $fetch<{ jwt: string }>(`${strapiUrl}/api/auth/local`, {
        method: 'POST',
        body: {
          identifier: email,
          password
        }
      })
      jwt = loginRes.jwt
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
    }
  } else {
    // Register new user
    console.log('[confirm-social] Registering new user:', { email, username })
    const createRes = await $fetch<{ jwt: string; user: StrapiUser }>(`${strapiUrl}/api/auth/local/register`, {
      method: 'POST',
      body: {
        username,
        email,
        password,
        confirmed: true
      }
    })
    console.log('[confirm-social] User registered:', createRes.user?.id)

    user = createRes.user
    jwt = createRes.jwt
  }

  // Step 3: Create Stripe customer and start trial
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

  return {
    jwt,
    user: {
      ...user,
      customerId: customer.id
    }
  }
  } catch (error: any) {
    console.error('[confirm-social] Error:', error?.message || error)
    console.error('[confirm-social] Stack:', error?.stack)
    throw error
  }
})
