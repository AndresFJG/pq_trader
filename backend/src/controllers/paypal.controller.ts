import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import paypalService from '../services/paypal.service';
import { UserService } from '../services/user.service';
import { logger, logTransaction, logSecurity } from '../utils/logger';
import { convertPrice } from '../config/pricing.config';
import TransactionService from '../services/transaction.service';
import { supabase } from '../config/supabase';

/**
 * @desc    Crear orden de PayPal
 * @route   POST /api/paypal/order
 * @access  Private
 */
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, currency = 'EUR' } = req.body;
    const userId = req.user?.id;
    const idempotencyKey = req.headers['idempotency-key'] as string;

    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
      return;
    }

    // 🔒 VALIDACIÓN: Verificar si ya compró este producto (no bloquear pendientes por idempotencia)
    const { data: completedTransactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .eq('metadata->>productId', productId.toString());

    if (completedTransactions && completedTransactions.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Ya has comprado este producto anteriormente.',
      });
      return;
    }

    // Buscar el producto en la base de datos (curso, mentoría, etc.)
    const { data: product, error: productError } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      // Si no es un curso, podría ser una mentoría o portfolio
      const { data: mentorship } = await supabase
        .from('mentorships')
        .select('id, title, price')
        .eq('id', productId)
        .single();

      if (!mentorship) {
        res.status(404).json({
          success: false,
          error: `Product not found with ID: ${productId}`,
        });
        return;
      }

      // Usar mentoría
      const finalAmount = currency === 'EUR' 
        ? mentorship.price 
        : convertPrice(mentorship.price, currency);

      const order = await paypalService.createOrder({
        amount: finalAmount,
        currency,
        userId: userId?.toString() || '',
        plan: mentorship.title,
        email: req.user?.email,
      });

      await TransactionService.createTransaction({
        userId: userId || 0,
        amount: finalAmount,
        currency,
        type: 'paypal',
        status: 'pending',
        paypalOrderId: order.id,
        productId: productId.toString(),
        productName: mentorship.title,
        productType: 'mentorship',
        metadata: {
          orderStatus: order.status,
          productType: 'mentorship',
          idempotencyKey,
        },
      });

      logger.info('PayPal order created for mentorship', {
        orderId: order.id,
        userId,
        amount: finalAmount,
      });

      res.status(201).json({
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
          approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
        },
      });
      return;
    }

    // Es un curso - usar su precio
    const finalAmount = currency === 'EUR' 
      ? product.price 
      : convertPrice(product.price, currency);

    const order = await paypalService.createOrder({
      amount: finalAmount,
      currency,
      userId: userId?.toString() || '',
      plan: product.title,
      email: req.user?.email,
    });

    // Crear transacción en estado pending
    await TransactionService.createTransaction({
      userId: userId || 0,
      amount: finalAmount,
      currency,
      type: 'paypal',
      status: 'pending',
      paypalOrderId: order.id,
      productId: productId.toString(),
      productName: product.title,
      productType: 'course',
      metadata: {
        orderStatus: order.status,
        productType: 'course',
        idempotencyKey,
      },
    });

    logger.info('PayPal order created for course', {
      orderId: order.id,
      userId,
      amount: finalAmount,
      productId,
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      },
    });
  } catch (error: any) {
    logger.error('Create PayPal order error', {
      error: error.message,
      userId: req.user?.id,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Capturar pago de PayPal
 * @route   POST /api/paypal/order/:orderId/capture
 * @access  Private
 */
export const captureOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    // Capturar pago en PayPal
    const capture = await paypalService.captureOrder(orderId);

    // Buscar la transacción existente
    const transaction = await TransactionService.getByPayPalOrderId(orderId);

    if (!transaction) {
      logger.error('Transaction not found for PayPal order', { orderId });
      // Crear transacción si no existe
      await TransactionService.createTransaction({
        userId: userId || 0,
        amount: parseFloat(capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0'),
        currency: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || 'USD',
        type: 'paypal',
        status: 'completed',
        paypalOrderId: orderId,
        paypalCaptureId: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        metadata: {
          captureStatus: capture.status,
        },
      });
    } else {
      // Actualizar transacción existente
      await TransactionService.updateTransactionStatus(
        transaction.id,
        'completed',
        {
          captureId: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id,
          captureStatus: capture.status,
          capturedAt: new Date().toISOString(),
        }
      );
    }

    // Actualizar usuario si es necesario
    const user = await UserService.findById(userId);
    if (user) {
      // Aquí puedes actualizar el tier de suscripción o lo que necesites
      logTransaction('PAYPAL_PAYMENT_CAPTURED', {
        userId: user.id,
        orderId,
        amount: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
      });
    }

    res.json({
      success: true,
      data: {
        orderId: capture.id,
        status: capture.status,
      },
    });
  } catch (error: any) {
    logger.error('Capture PayPal order error', {
      error: error.message,
      userId: req.user?.id,
      orderId: req.params.orderId,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener detalles de orden
 * @route   GET /api/paypal/order/:orderId
 * @access  Private
 */
export const getOrderDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await paypalService.getOrderDetails(orderId);

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    logger.error('Get PayPal order details error', {
      error: error.message,
      userId: req.user?.id,
      orderId: req.params.orderId,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Reembolsar pago
 * @route   POST /api/paypal/refund/:captureId
 * @access  Private (Admin)
 */
export const refundPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { captureId } = req.params;
    const { amount, currency } = req.body;

    const refundAmount = amount && currency 
      ? { value: amount.toString(), currency_code: currency }
      : undefined;

    const refund = await paypalService.refundPayment(captureId, refundAmount);

    logTransaction('PAYPAL_REFUND_ISSUED', {
      adminId: req.user?.id,
      captureId,
      amount,
    });

    res.json({
      success: true,
      data: {
        refundId: refund.id,
        status: refund.status,
      },
    });
  } catch (error: any) {
    logger.error('Refund PayPal payment error', {
      error: error.message,
      userId: req.user?.id,
      captureId: req.params.captureId,
    });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Webhook de PayPal (CRÍTICO)
 * @route   POST /api/paypal/webhook
 * @access  Public (con validación de firma)
 */
export const handleWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

    // Verificar firma del webhook
    const isValid = await paypalService.verifyWebhookSignature(
      webhookId,
      req.headers,
      req.body
    );

    if (!isValid) {
      logSecurity('PAYPAL_WEBHOOK_INVALID_SIGNATURE', {
        ip: req.ip,
      });
      res.status(400).json({
        success: false,
        error: 'Invalid signature',
      });
      return;
    }

    const event = req.body;

    // Procesar eventos de PayPal
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const resource = event.resource;
        logTransaction('PAYPAL_PAYMENT_COMPLETED', {
          captureId: resource.id,
          amount: resource.amount?.value,
        });
        // TODO: Actualizar estado del usuario
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED': {
        const resource = event.resource;
        logSecurity('PAYPAL_PAYMENT_DENIED', {
          captureId: resource.id,
        });
        // TODO: Notificar al usuario
        break;
      }

      case 'BILLING.SUBSCRIPTION.CREATED':
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const resource = event.resource;
        logTransaction('PAYPAL_SUBSCRIPTION_ACTIVATED', {
          subscriptionId: resource.id,
        });
        // TODO: Actualizar suscripción del usuario
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const resource = event.resource;
        logTransaction('PAYPAL_SUBSCRIPTION_CANCELLED', {
          subscriptionId: resource.id,
        });
        // TODO: Desactivar suscripción del usuario
        break;
      }

      default:
        logger.info(`Unhandled PayPal event type: ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error('PayPal webhook error', {
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: 'Webhook error',
    });
  }
};
