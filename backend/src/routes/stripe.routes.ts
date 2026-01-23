import { Router } from 'express';
import {
  createCheckoutSession,
  createPaymentIntent,
  handleWebhook,
  getSessionDetails,
  verifySessionAndCreateEnrollment,
} from '../controllers/stripe.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/stripe/checkout
 * @desc    Crear sesión de checkout de Stripe
 * @access  Private
 */
router.post('/checkout', protect, createCheckoutSession);

/**
 * @route   POST /api/stripe/payment-intent
 * @desc    Crear Payment Intent
 * @access  Private
 */
router.post('/payment-intent', protect, createPaymentIntent);

/**
 * @route   POST /api/stripe/verify-session
 * @desc    Verificar sesión y crear enrollment
 * @access  Private
 */
router.post('/verify-session', protect, verifySessionAndCreateEnrollment);

/**
 * @route   POST /api/stripe/webhook
 * @desc    Webhook de eventos de Stripe
 * @access  Public (validado por Stripe signature)
 */
router.post('/webhook', handleWebhook);

/**
 * @route   GET /api/stripe/session/:sessionId
 * @desc    Obtener detalles de sesión
 * @access  Private
 */
router.get('/session/:sessionId', protect, getSessionDetails);

export default router;
