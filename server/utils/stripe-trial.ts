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
    // Check for existing Stripe customer by email (prevent duplicates)
    const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 })
    let customer
    let subscription
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
      console.log('[stripe-trial] Found existing Stripe customer:', customer.id)
      
      // Check if customer already has an active/trialing subscription
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 1
      })
      
      if (existingSubscriptions.data.length > 0) {
        const existingSub = existingSubscriptions.data[0]
        // Only use existing sub if it's active or trialing
        if (existingSub.status === 'active' || existingSub.status === 'trialing') {
          console.log('[stripe-trial] Found existing subscription:', existingSub.id, 'status:', existingSub.status)
          subscription = existingSub
        } else {
          console.log('[stripe-trial] Existing subscription is', existingSub.status, '- creating new one')
        }
      }
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          appUserId: String(user.id)
        }
      })
      console.log('[stripe-trial] Customer created:', customer.id)
    }

    // Only create subscription if customer doesn't have an active one
    if (!subscription) {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: config.stripeDefaultPriceId
          }
        ],
        trial_period_days: 30
      })
      console.log('[stripe-trial] Subscription created:', subscription.id)
    }

    return {
      id: customer.id,
      subscriptionId: subscription.id,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    }
  } catch (error: any) {
    console.error('[stripe-trial] Stripe API error:', error?.message)
    console.error('[stripe-trial] Stripe error type:', error?.type)
    console.error('[stripe-trial] Stripe error code:', error?.code)
    throw new Error(`Stripe error: ${error?.message || 'Unknown error'}`)
  }
}
