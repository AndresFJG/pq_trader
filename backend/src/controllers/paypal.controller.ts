import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import paypalService from '../services/paypal.service';
// import User from '../models/User.model'; // TODO: Migrar a Supabase UserService
import { logger, logTransaction, logSecurity } from '../utils/logger';

/**
 * @desc    Crear orden de PayPal
 * @route   POST /api/paypal/order
 * @access  Private
 */
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'USD', plan } = req.body;
    const userId = req.user?._id;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
      return;
    }

    const order = await paypalService.createOrder(
      amount,
      currency,
      {
        userId: userId?.toString(),
        plan,
        email: req.user?.email,
      }
    );

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
      },
    });
  } catch (error: any) {
    logger.error('Create PayPal order error', {
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
 * @desc    Capturar pago de PayPal
 * @route   POST /api/paypal/order/:orderId/capture
 * @access  Private
 */
export const captureOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id;

    const capture = await paypalService.captureOrder(orderId);

    // Actualizar usuario si es necesario
    const user = await User.findById(userId);
    if (user) {
      // Aquí puedes actualizar el tier de suscripción o lo que necesites
      logTransaction('PAYPAL_PAYMENT_CAPTURED', {
        userId: user._id,
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
      userId: req.user?._id,
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
      userId: req.user?._id,
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

    const refund = await paypalService.refundPayment(captureId, amount, currency);

    logTransaction('PAYPAL_REFUND_ISSUED', {
      adminId: req.user?._id,
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
      userId: req.user?._id,
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
      req.headers,
      req.body,
      webhookId
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
