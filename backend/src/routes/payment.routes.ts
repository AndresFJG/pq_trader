import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { paymentLimiter } from '../middleware/rateLimiter.middleware';
import { convertPrice } from '../config/pricing.config';
import { logger } from '../utils/logger';
import { supabase } from '../config/supabase';

const router = Router();

/**
 * @desc    Crear payment intent unificado (Stripe/PayPal)
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
router.post('/create-payment-intent', protect, paymentLimiter, async (req, res) => {
  try {
    const { productId, paymentMethod = 'card', currency = 'EUR', customAmount, productName } = req.body;
    const userId = req.user?.id;

    // Determinar el monto final
    let finalAmount: number;
    let finalProductName: string;

    if (customAmount && customAmount > 0) {
      finalAmount = customAmount;
      finalProductName = productName || 'Custom Payment';
    } else if (productId) {
      // Buscar SOLO en la base de datos
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title, price')
        .eq('id', productId)
        .single();

      if (course) {
        finalAmount = currency === 'EUR' 
          ? course.price 
          : convertPrice(course.price, currency);
        
        finalProductName = course.title;
      } else {
        // Si no es curso, buscar en mentorships
        const { data: mentorship, error: mentorshipError } = await supabase
          .from('mentorships')
          .select('id, title, price')
          .eq('id', productId)
          .single();

        if (mentorship) {
          finalAmount = currency === 'EUR' 
            ? mentorship.price 
            : convertPrice(mentorship.price, currency);
          
          finalProductName = mentorship.title;
        } else {
          // Producto no encontrado en ninguna tabla
          return res.status(404).json({
            success: false,
            error: `Producto no encontrado en la base de datos con ID: ${productId}`,
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either productId or customAmount is required',
      });
    }

    logger.info('Payment intent created', {
      userId,
      productId,
      amount: finalAmount,
      currency,
      paymentMethod,
    });

    // Retornar información del pago
    res.status(200).json({
      success: true,
      data: {
        amount: finalAmount,
        currency,
        productName: finalProductName,
        paymentMethod,
        message: 'Payment intent created. Proceed with payment provider.',
      },
    });
  } catch (error: any) {
    logger.error('Create payment intent error', {
      error: error.message,
      userId: req.user?.id,
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating payment intent',
    });
  }
});

router.post('/create-subscription', protect, paymentLimiter, (req, res) => {
  res.json({ success: true, message: 'Create subscription route' });
});

router.post('/cancel-subscription', protect, (req, res) => {
  res.json({ success: true, message: 'Cancel subscription route' });
});

router.post('/webhook', (req, res) => {
  res.json({ success: true, message: 'Stripe webhook route' });
});

router.get('/history', protect, (req, res) => {
  res.json({ success: true, message: 'Payment history route' });
});

export default router;
