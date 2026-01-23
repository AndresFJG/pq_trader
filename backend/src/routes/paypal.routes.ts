import { Router } from 'express';
import {
  createOrder,
  captureOrder,
  getOrderDetails,
  refundPayment,
  handleWebhook,
} from '../controllers/paypal.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { paymentLimiter, webhookLimiter } from '../middleware/rateLimiter.middleware';
import { idempotency } from '../middleware/idempotency.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createPayPalOrderSchema,
  refundPaymentSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * Webhook de PayPal (público pero con validación de firma)
 */
router.post('/webhook', webhookLimiter, handleWebhook);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.use(protect); // Todas las rutas siguientes requieren autenticación
router.use(paymentLimiter); // Rate limiting para pagos

// 🔒 Idempotencia: Previene pagos duplicados
router.post('/order', idempotency, validate(createPayPalOrderSchema), createOrder);
router.post('/order/:orderId/capture', captureOrder);
router.get('/order/:orderId', getOrderDetails);

/**
 * Rutas de admin
 */
router.post('/refund/:captureId', authorize('admin'), validate(refundPaymentSchema), refundPayment);

export default router;
