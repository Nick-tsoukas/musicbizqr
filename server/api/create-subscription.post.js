import { defineEventHandler, readBody } from 'h3';
import { useServerStripe } from '#stripe/server';

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readBody(event);
  const { email, paymentMethodId } = body;

  try {
    // Create a new customer
    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription with trial period
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'your_price_id' }], // Replace with your actual price ID
      trial_period_days: 30,
    });

    // Send back subscription details
    return {
      subscription,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: error.message });
  }
});
