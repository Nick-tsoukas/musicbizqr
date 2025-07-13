import Stripe from 'stripe'
import { useRuntimeConfig } from '#imports'

type MinimalUser = {
  id: number | string
  email: string
  username: string
}

export async function createStripeCustomerAndTrial(user: MinimalUser) {
  const config = useRuntimeConfig()

  const stripe = new Stripe(config.stripeSecretKey)

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.username,
    metadata: {
      appUserId: String(user.id)
    }
  })

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: config.stripeDefaultPriceId
      }
    ],
    trial_period_days: 30
  })

  return {
    id: customer.id,
    subscriptionId: subscription.id,
    trialEndsAt: new Date(subscription.trial_end! * 1000).toISOString()
  }
}
