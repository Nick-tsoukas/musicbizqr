import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * Admin endpoint to reset a user's password directly.
 * This is a temporary utility - should be removed or secured in production.
 * 
 * POST /api/admin/reset-user-password
 * Body: { email: string, newPassword: string }
 */
export default defineEventHandler(async (event) => {
  const { email, newPassword } = await readBody(event)

  if (!email || !newPassword) {
    return {
      statusCode: 400,
      error: 'Missing email or newPassword'
    }
  }

  const config = useRuntimeConfig()
  const strapiUrl = config.public.strapiUrl
  const apiToken = config.strapiApiToken

  if (!apiToken) {
    return {
      statusCode: 500,
      error: 'Strapi API token not configured'
    }
  }

  try {
    // Step 1: Find user by email
    const users = await $fetch<any[]>(`${strapiUrl}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    if (!users || users.length === 0) {
      return {
        statusCode: 404,
        error: 'User not found'
      }
    }

    const user = users[0]
    console.log(`[reset-password] Found user: ${user.id} - ${user.email}`)

    // Step 2: Update password
    await $fetch(`${strapiUrl}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`
      },
      body: {
        password: newPassword,
        confirmed: true
      }
    })

    console.log(`[reset-password] Password updated for user ${user.id}`)

    return {
      success: true,
      message: `Password reset for ${email}`
    }
  } catch (err: any) {
    console.error('[reset-password] Error:', err)
    return {
      statusCode: 500,
      error: err?.message || 'Failed to reset password'
    }
  }
})
