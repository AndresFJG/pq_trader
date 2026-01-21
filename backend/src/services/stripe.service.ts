import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

export class StripeService {
  /**
   * Create a new customer in Stripe
   */
  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      name,
    });
  }

  /**
   * Create a subscription for a customer
   */
  async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
  }

  /**
   * Create payment intent for one-time payment
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  /**
   * Retrieve subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * List customer's payment methods
   */
  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}

export default new StripeService();
