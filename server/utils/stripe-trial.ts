import Stripe from 'stripe'
import { useRuntimeConfig } from '#imports'

type MinimalUser = {
  id: number | string
  email: string
  username: string
}

export async function createStripeCustomerAndTrial(user: MinimalUser) {
  const config = useRuntimeConfig()

  // Validate config
  if (!config.stripeSecretKey) {
    console.error('[stripe-trial] STRIPE_SECRET_KEY not configured')
    throw new Error('Stripe configuration error - missing secret key')
  }
  if (!config.stripeDefaultPriceId) {
    console.error('[stripe-trial] STRIPE_DEFAULT_PRICE_ID not configured')
    throw new Error('Stripe configuration error - missing default price ID')
  }

  console.log('[stripe-trial] Creating Stripe customer for user:', user.id, user.email)

  const stripe = new Stripe(config.stripeSecretKey)

  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      metadata: {
        appUserId: String(user.id)
      }
    })
    console.log('[stripe-trial] Customer created:', customer.id)

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: config.stripeDefaultPriceId
        }
      ],
      trial_period_days: 30
    })
    console.log('[stripe-trial] Subscription created:', subscription.id)

    return {
      id: customer.id,
      subscriptionId: subscription.id,
      trialEndsAt: new Date(subscription.trial_end! * 1000).toISOString()
    }
  } catch (error: any) {
    console.error('[stripe-trial] Stripe API error:', error?.message)
    console.error('[stripe-trial] Stripe error type:', error?.type)
    console.error('[stripe-trial] Stripe error code:', error?.code)
    throw new Error(`Stripe error: ${error?.message || 'Unknown error'}`)
  }
}
