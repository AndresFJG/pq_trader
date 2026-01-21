import { Router } from 'express';
import { 
  createPaymentIntent, 
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus 
} from '../controllers/paymentController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Crear Payment Intent (para pagos directos)
router.post('/create-payment-intent', createPaymentIntent);

// Crear Checkout Session (para redirigir a Stripe)
router.post('/create-checkout-session', createCheckoutSession);

// Webhook de Stripe (no requiere auth)
router.post('/webhook', handleWebhook);

// Obtener estado de pago (requiere auth)
router.get('/status/:sessionId', protect, getPaymentStatus);

export default router;
