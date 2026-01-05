import { Request, Response } from 'express';
import { MercadoPagoService } from '../services/mercadopagoService';
import { PixService } from '../services/pixService';
import { SEPAService } from '../services/sepaService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const mercadoPago = new MercadoPagoService();
const pixService = new PixService();
const sepaService = new SEPAService();

// @desc    Create payment intent based on payment method
// @route   POST /api/payments/create
// @access  Private
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency, paymentMethod, userCountry, metadata } = req.body;

    // Validate input
    if (!amount || !currency || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, currency, paymentMethod',
      });
    }

    let paymentIntent;

    switch (paymentMethod) {
      case 'stripe':
      case 'card':
        // Stripe payment (tarjetas)
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata: metadata || {},
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return res.status(200).json({
          success: true,
          data: {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
          },
        });

      case 'mercadopago':
        // Mercado Pago (LATAM)
        const mpPayment = await mercadoPago.createPayment({
          amount,
          currency,
          description: metadata?.description || 'PQ Trader Purchase',
          email: metadata?.email,
        });

        return res.status(200).json({
          success: true,
          data: mpPayment,
        });

      case 'pix':
        // PIX (Brazil)
        const pixPayment = await pixService.createPayment({
          amount,
          description: metadata?.description || 'PQ Trader Purchase',
          email: metadata?.email,
        });

        return res.status(200).json({
          success: true,
          data: pixPayment,
        });

      case 'sepa':
        // SEPA transfer (EU)
        const sepaPayment = await sepaService.createPayment({
          amount,
          currency,
          iban: metadata?.iban,
          name: metadata?.name,
          description: metadata?.description || 'PQ Trader Purchase',
        });

        return res.status(200).json({
          success: true,
          data: sepaPayment,
        });

      case 'paypal':
        // PayPal (implementar según sea necesario)
        return res.status(501).json({
          success: false,
          error: 'PayPal integration coming soon',
        });

      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported payment method: ${paymentMethod}`,
        });
    }
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error creating payment',
    });
  }
};

// @desc    Get available payment methods based on country
// @route   GET /api/payments/methods/:country
// @access  Public
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const { country } = req.params;

    const methods = [
      {
        id: 'stripe',
        name: 'Tarjeta de Crédito/Débito',
        available: true,
        processingTime: 'Instantáneo',
      },
      {
        id: 'paypal',
        name: 'PayPal',
        available: true,
        processingTime: 'Instantáneo',
      },
    ];

    // LATAM countries
    if (['AR', 'MX', 'CO', 'CL', 'PE', 'UY'].includes(country.toUpperCase())) {
      methods.push({
        id: 'mercadopago',
        name: 'Mercado Pago',
        available: true,
        processingTime: 'Instantáneo',
      });
    }

    // Brazil
    if (country.toUpperCase() === 'BR') {
      methods.push({
        id: 'pix',
        name: 'PIX',
        available: true,
        processingTime: 'Instantáneo',
      });
    }

    // EU countries
    if (['ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE'].includes(country.toUpperCase())) {
      methods.push({
        id: 'sepa',
        name: 'Transferencia SEPA',
        available: true,
        processingTime: '1-3 días hábiles',
      });
    }

    return res.status(200).json({
      success: true,
      data: methods,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm/:paymentId
// @access  Private
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod } = req.body;

    let confirmation;

    switch (paymentMethod) {
      case 'stripe':
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        confirmation = {
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        };
        break;

      case 'mercadopago':
        confirmation = await mercadoPago.getPaymentStatus(paymentId);
        break;

      case 'pix':
        confirmation = await pixService.getPaymentStatus(paymentId);
        break;

      case 'sepa':
        confirmation = await sepaService.getPaymentStatus(paymentId);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid payment method',
        });
    }

    return res.status(200).json({
      success: true,
      data: confirmation,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
