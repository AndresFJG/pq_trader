import Stripe from 'stripe';
import { Request } from 'express';
import { logger, logTransaction, logSecurity } from '../utils/logger';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

class StripeService {
  /**
   * Crear customer de Stripe
   */
  async createCustomer(email: string, name: string, metadata?: any) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });

      logTransaction('STRIPE_CUSTOMER_CREATED', {
        customerId: customer.id,
        email,
      });

      return customer;
    } catch (error: any) {
      logger.error('Stripe create customer error', { error: error.message });
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  /**
   * Crear suscripción
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: any
  ) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: metadata || {},
      });

      logTransaction('STRIPE_SUBSCRIPTION_CREATED', {
        subscriptionId: subscription.id,
        customerId,
        priceId,
        status: subscription.status,
      });

      return subscription;
    } catch (error: any) {
      logger.error('Stripe create subscription error', { error: error.message });
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  /**
   * Crear Payment Intent (pagos únicos)
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    metadata?: any
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata || {},
      });

      logTransaction('STRIPE_PAYMENT_INTENT_CREATED', {
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
        customerId,
      });

      return paymentIntent;
    } catch (error: any) {
      logger.error('Stripe create payment intent error', { error: error.message });
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Cancelar suscripción
   */
  async cancelSubscription(subscriptionId: string, immediately = false) {
    try {
      let subscription;

      if (immediately) {
        subscription = await stripe.subscriptions.cancel(subscriptionId);
      } else {
        subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      }

      logTransaction('STRIPE_SUBSCRIPTION_CANCELLED', {
        subscriptionId,
        immediately,
        status: subscription.status,
      });

      return subscription;
    } catch (error: any) {
      logger.error('Stripe cancel subscription error', { error: error.message });
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Reactivar suscripción cancelada
   */
  async reactivateSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      logTransaction('STRIPE_SUBSCRIPTION_REACTIVATED', {
        subscriptionId,
      });

      return subscription;
    } catch (error: any) {
      logger.error('Stripe reactivate subscription error', { error: error.message });
      throw new Error(`Failed to reactivate subscription: ${error.message}`);
    }
  }

  /**
   * Crear reembolso
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ) {
    try {
      const refundData: any = {
        payment_intent: paymentIntentId,
        reason: reason || 'requested_by_customer',
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      logTransaction('STRIPE_REFUND_CREATED', {
        refundId: refund.id,
        paymentIntentId,
        amount: refund.amount / 100,
        reason,
      });

      return refund;
    } catch (error: any) {
      logger.error('Stripe create refund error', { error: error.message });
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  /**
   * Obtener detalles de customer
   */
  async getCustomer(customerId: string) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error: any) {
      logger.error('Stripe get customer error', { error: error.message });
      throw new Error(`Failed to get customer: ${error.message}`);
    }
  }

  /**
   * Obtener detalles de suscripción
   */
  async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error: any) {
      logger.error('Stripe get subscription error', { error: error.message });
      throw new Error(`Failed to get subscription: ${error.message}`);
    }
  }

  /**
   * Verificar webhook de Stripe (CRÍTICO PARA SEGURIDAD)
   */
  verifyWebhook(req: Request): Stripe.Event | null {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        logSecurity('STRIPE_WEBHOOK_MISSING_SIGNATURE', {
          hasSignature: !!sig,
          hasSecret: !!webhookSecret,
        });
        return null;
      }

      // El body debe estar en formato raw (Buffer o string)
      const rawBody = req.body;

      if (!rawBody) {
        logSecurity('STRIPE_WEBHOOK_NO_BODY', {});
        return null;
      }

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig as string,
        webhookSecret
      );

      logTransaction('STRIPE_WEBHOOK_VERIFIED', {
        eventId: event.id,
        eventType: event.type,
      });

      return event;
    } catch (error: any) {
      logSecurity('STRIPE_WEBHOOK_VERIFICATION_FAILED', {
        error: error.message,
      });

      logger.error('Stripe webhook verification failed', {
        error: error.message,
      });

      return null;
    }
  }

  /**
   * Crear portal de billing para el cliente
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      logTransaction('STRIPE_BILLING_PORTAL_CREATED', {
        customerId,
        sessionId: session.id,
      });

      return session;
    } catch (error: any) {
      logger.error('Stripe create billing portal error', { error: error.message });
      throw new Error(`Failed to create billing portal: ${error.message}`);
    }
  }

  /**
   * Crear Checkout Session
   */
  async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: any
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata || {},
      });

      logTransaction('STRIPE_CHECKOUT_SESSION_CREATED', {
        sessionId: session.id,
        customerId,
        priceId,
      });

      return session;
    } catch (error: any) {
      logger.error('Stripe create checkout session error', { error: error.message });
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  /**
   * Reportar fraude
   */
  async reportFraud(paymentIntentId: string) {
    try {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          fraud_reported: 'true',
          reported_at: new Date().toISOString(),
        },
      });

      logSecurity('STRIPE_FRAUD_REPORTED', {
        paymentIntentId,
      });

      logger.warn('Fraud reported', { paymentIntentId });
    } catch (error: any) {
      logger.error('Stripe report fraud error', { error: error.message });
    }
  }
}

export default new StripeService();
