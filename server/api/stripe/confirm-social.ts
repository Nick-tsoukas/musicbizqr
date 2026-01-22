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

  // Step 1: Check if user already exists
  const existingUsers = await $fetch<StrapiUser[]>(`${strapiUrl}/api/users?filters[email][$eq]=${email}`)

  let user: StrapiUser
  let jwt: string

  if (existingUsers.length > 0) {
    user = existingUsers[0]

    // Log in existing user to get JWT
    const loginRes = await $fetch<{ jwt: string }>(`${strapiUrl}/api/auth/local`, {
      method: 'POST',
      body: {
        identifier: email,
        password
      }
    })

    jwt = loginRes.jwt
  } else {
    // Register new user
    const createRes = await $fetch<{ jwt: string; user: StrapiUser }>(`${strapiUrl}/api/auth/local/register`, {
      method: 'POST',
      body: {
        username: name,
        email,
        password,
        confirmed: true
      }
    })

    user = createRes.user
    jwt = createRes.jwt
  }

  // Step 3: Create Stripe customer and start trial
  const customer = await createStripeCustomerAndTrial(user)

  // Step 4: Update Strapi user with Stripe data
  await $fetch(`${strapiUrl}/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`
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
})
