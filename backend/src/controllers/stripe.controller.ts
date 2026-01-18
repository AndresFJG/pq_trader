import { Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middleware/auth.middleware';
import stripeService from '../services/stripe-secure.service';
import User from '../models/User.model';
import { logger, logTransaction, logSecurity } from '../utils/logger';

/**
 * @desc    Crear customer de Stripe
 * @route   POST /api/stripe/customer
 * @access  Private
 */
export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;
    const userId = req.user?._id;

    // Verificar si ya tiene un customer
    const user = await User.findById(userId);
    if (user?.stripeCustomerId) {
      res.status(400).json({
        success: false,
        error: 'Customer already exists',
      });
      return;
    }

    const customer = await stripeService.createCustomer(
      email || req.user?.email!,
      name || req.user?.name!,
      { userId: userId?.toString() }
    );

    // Guardar customer ID en el usuario
    await User.findByIdAndUpdate(userId, {
      stripeCustomerId: customer.id,
    });

    res.status(201).json({
      success: true,
      data: {
        customerId: customer.id,
      },
    });
  } catch (error: any) {
    logger.error('Create Stripe customer error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Crear suscripción
 * @route   POST /api/stripe/subscription
 * @access  Private
 */
export const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { priceId } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    let customerId = user.stripeCustomerId;

    // Crear customer si no existe
    if (!customerId) {
      const customer = await stripeService.createCustomer(
        user.email,
        user.name,
        { userId: userId?.toString() }
      );
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const subscription = await stripeService.createSubscription(
      customerId,
      priceId,
      {
        userId: userId?.toString(),
        email: user.email,
      }
    );

    // Actualizar usuario con subscription ID
    await User.findByIdAndUpdate(userId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    });

    res.status(201).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        status: subscription.status,
      },
    });
  } catch (error: any) {
    logger.error('Create subscription error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Crear Payment Intent (pago único)
 * @route   POST /api/stripe/payment-intent
 * @access  Private
 */
export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;
    const userId = req.user?._id;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    let customerId = user.stripeCustomerId;

    // Crear customer si no existe
    if (!customerId) {
      const customer = await stripeService.createCustomer(
        user.email,
        user.name,
        { userId: userId?.toString() }
      );
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency,
      customerId,
      {
        userId: userId?.toString(),
        ...metadata,
      }
    );

    res.status(201).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    logger.error('Create payment intent error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Cancelar suscripción
 * @route   POST /api/stripe/subscription/cancel
 * @access  Private
 */
export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { immediately = false } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user?.stripeSubscriptionId) {
      res.status(404).json({
        success: false,
        error: 'No active subscription found',
      });
      return;
    }

    const subscription = await stripeService.cancelSubscription(
      user.stripeSubscriptionId,
      immediately
    );

    // Actualizar estado en el usuario
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: immediately ? 'canceled' : 'canceling',
    });

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } catch (error: any) {
    logger.error('Cancel subscription error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Reactivar suscripción
 * @route   POST /api/stripe/subscription/reactivate
 * @access  Private
 */
export const reactivateSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user?.stripeSubscriptionId) {
      res.status(404).json({
        success: false,
        error: 'No subscription found',
      });
      return;
    }

    const subscription = await stripeService.reactivateSubscription(
      user.stripeSubscriptionId
    );

    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: subscription.status,
    });

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
      },
    });
  } catch (error: any) {
    logger.error('Reactivate subscription error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Crear Checkout Session
 * @route   POST /api/stripe/checkout-session
 * @access  Private
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    let customerId = user.stripeCustomerId;

    // Crear customer si no existe
    if (!customerId) {
      const customer = await stripeService.createCustomer(
        user.email,
        user.name,
        { userId: userId?.toString() }
      );
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripeService.createCheckoutSession(
      priceId,
      customerId,
      successUrl || `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancelUrl || `${process.env.FRONTEND_URL}/pricing?payment=canceled`,
      {
        userId: userId?.toString(),
      }
    );

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    logger.error('Create checkout session error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Crear portal de billing
 * @route   POST /api/stripe/billing-portal
 * @access  Private
 */
export const createBillingPortal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { returnUrl } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user?.stripeCustomerId) {
      res.status(404).json({
        success: false,
        error: 'No Stripe customer found',
      });
      return;
    }

    const session = await stripeService.createBillingPortalSession(
      user.stripeCustomerId,
      returnUrl || `${process.env.FRONTEND_URL}/dashboard`
    );

    res.json({
      success: true,
      data: {
        url: session.url,
      },
    });
  } catch (error: any) {
    logger.error('Create billing portal error', {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Webhook de Stripe (CRÍTICO)
 * @route   POST /api/stripe/webhook
 * @access  Public (con validación de firma)
 */
export const handleWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verificar firma del webhook
    const event = stripeService.verifyWebhook(req);

    if (!event) {
      logSecurity('STRIPE_WEBHOOK_INVALID_SIGNATURE', {
        ip: req.ip,
      });
      res.status(400).json({
        success: false,
        error: 'Invalid signature',
      });
      return;
    }

    // Procesar eventos
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionTier: subscription.metadata?.tier || 'basic',
          });

          logTransaction('STRIPE_SUBSCRIPTION_UPDATED', {
            userId,
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            subscriptionStatus: 'canceled',
            stripeSubscriptionId: null,
          });

          logTransaction('STRIPE_SUBSCRIPTION_DELETED', {
            userId,
            subscriptionId: subscription.id,
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        if (subscription) {
          const user = await User.findOne({ stripeSubscriptionId: subscription });
          if (user) {
            await User.findByIdAndUpdate(user._id, {
              subscriptionStatus: 'active',
            });

            logTransaction('STRIPE_PAYMENT_SUCCEEDED', {
              userId: user._id,
              invoiceId: invoice.id,
              amount: invoice.amount_paid / 100,
            });

            // TODO: Enviar email de confirmación
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        if (subscription) {
          const user = await User.findOne({ stripeSubscriptionId: subscription });
          if (user) {
            await User.findByIdAndUpdate(user._id, {
              subscriptionStatus: 'past_due',
            });

            logSecurity('STRIPE_PAYMENT_FAILED', {
              userId: user._id,
              invoiceId: invoice.id,
            });

            // TODO: Enviar email de fallo de pago
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          logTransaction('STRIPE_PAYMENT_INTENT_SUCCEEDED', {
            userId,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
          });

          // TODO: Enviar recibo
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          logSecurity('STRIPE_PAYMENT_INTENT_FAILED', {
            userId,
            paymentIntentId: paymentIntent.id,
            lastError: paymentIntent.last_payment_error?.message,
          });
        }
        break;
      }

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error('Stripe webhook error', {
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Webhook error',
    });
  }
};
