import express from 'express';
import {
  createPaymentIntent,
  getPaymentMethods,
  confirmPayment,
} from '../controllers/multiPaymentController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/methods/:country', getPaymentMethods);

// Protected routes
router.post('/create', protect, createPaymentIntent);
router.post('/confirm/:paymentId', protect, confirmPayment);

export default router;
