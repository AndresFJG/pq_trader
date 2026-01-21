import { Router } from 'express';
import {
  createCustomer,
  createSubscription,
  createPaymentIntent,
  cancelSubscription,
  reactivateSubscription,
  createCheckoutSession,
  createBillingPortal,
  handleWebhook,
} from '../controllers/stripe.controller';
import { protect } from '../middleware/auth.middleware';
import { paymentLimiter, webhookLimiter } from '../middleware/rateLimiter.middleware';
import { stripeWebhookMiddleware } from '../middleware/stripe.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createSubscriptionSchema,
  createPaymentIntentSchema,
  cancelSubscriptionSchema,
  createCheckoutSessionSchema,
  createBillingPortalSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * Webhook de Stripe (público pero con validación de firma)
 * IMPORTANTE: Debe estar ANTES del middleware de JSON parsing
 */
router.post(
  '/webhook',
  webhookLimiter,
  stripeWebhookMiddleware,
  handleWebhook
);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.use(protect); // Todas las rutas siguientes requieren autenticación
router.use(paymentLimiter); // Rate limiting para pagos

router.post('/customer', createCustomer);
router.post('/subscription', validate(createSubscriptionSchema), createSubscription);
router.post('/payment-intent', validate(createPaymentIntentSchema), createPaymentIntent);
router.post('/subscription/cancel', validate(cancelSubscriptionSchema), cancelSubscription);
router.post('/subscription/reactivate', reactivateSubscription);
router.post('/checkout-session', validate(createCheckoutSessionSchema), createCheckoutSession);
router.post('/billing-portal', validate(createBillingPortalSchema), createBillingPortal);

export default router;
