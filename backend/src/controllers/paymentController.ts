import { Request, Response } from 'express';
import Stripe from 'stripe';

// Validar que existe la clave de Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  STRIPE_SECRET_KEY no configurada. Los pagos no funcionarán.');
}

// Inicializar Stripe con la última versión estable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

interface PaymentIntentRequest {
  productType: string;
  productId: string;
  productName: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  customerEmail: string;
  customerName: string;
  customerCountry?: string;
}

// Crear Payment Intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      productType, 
      productId, 
      productName, 
      amount,
      currency = 'eur',
      paymentMethod = 'card',
      customerEmail,
      customerName,
      customerCountry
    }: PaymentIntentRequest = req.body;

    // Validación de campos requeridos
    if (!productType || !productId || !productName) {
      res.status(400).json({ 
        success: false, 
        error: 'Faltan campos requeridos: productType, productId, productName' 
      });
      return;
    }

    if (!customerEmail || !customerName) {
      res.status(400).json({ 
        success: false, 
        error: 'Faltan datos del cliente: email y nombre son requeridos' 
      });
      return;
    }

    // Validación de monto mínimo
    if (!amount || amount < 50) {
      res.status(400).json({ 
        success: false, 
        error: 'El monto debe ser al menos 0.50 en tu moneda' 
      });
      return;
    }

    // Normalizar y validar moneda
    const normalizedCurrency = currency.toLowerCase();
    const supportedCurrencies = ['eur', 'usd', 'gbp', 'mxn', 'ars', 'cop', 'clp'];
    
    if (!supportedCurrencies.includes(normalizedCurrency)) {
      res.status(400).json({ 
        success: false, 
        error: `Moneda no soportada. Use una de: ${supportedCurrencies.join(', ')}` 
      });
      return;
    }

    // Lista de métodos de pago soportados por Stripe
    const paymentMethodTypes: string[] = [];
    
    switch(paymentMethod) {
      case 'card':
        paymentMethodTypes.push('card');
        break;
      case 'paypal':
        // PayPal solo disponible en USD, EUR, GBP
        if (['usd', 'eur', 'gbp'].includes(normalizedCurrency)) {
          paymentMethodTypes.push('paypal');
        } else {
          paymentMethodTypes.push('card');
        }
        break;
      case 'google-pay':
      case 'apple-pay':
        // Wallets digitales usan card como base
        paymentMethodTypes.push('card');
        break;
      case 'sepa':
        // SEPA solo para EUR
        if (normalizedCurrency === 'eur') {
          paymentMethodTypes.push('sepa_debit');
        } else {
          paymentMethodTypes.push('card');
        }
        break;
      default:
        paymentMethodTypes.push('card');
    }
    
    // Asegurar que al menos haya un método de pago
    if (paymentMethodTypes.length === 0) {
      paymentMethodTypes.push('card');
    }

    // Crear Payment Intent en Stripe
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount),
      currency: normalizedCurrency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        productType,
        productId,
        productName,
        customerEmail,
        customerName,
        customerCountry: customerCountry || 'unknown',
        paymentMethod: paymentMethod || 'card',
      },
      description: `${productType}: ${productName}`,
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    };

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      sessionId: paymentIntent.id, // Para compatibilidad
    });

  } catch (error: any) {
    console.error('Error creando Payment Intent:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error procesando el pago' 
    });
  }
};

// Crear Checkout Session (redirige a página de Stripe)
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      productType, 
      productId, 
      productName, 
      amount,
      currency = 'eur',
      // paymentMethod = 'card', // No se usa en esta función
      customerEmail 
    }: PaymentIntentRequest = req.body;

    // Validar campos requeridos
    if (!productType || !productId || !productName || !customerEmail) {
      res.status(400).json({ 
        success: false, 
        error: 'Faltan campos requeridos' 
      });
      return;
    }

    if (!amount || amount < 50) {
      res.status(400).json({ 
        success: false, 
        error: 'Monto inválido' 
      });
      return;
    }

    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/cancel`;

    // Normalizar moneda
    const normalizedCurrency = currency.toLowerCase();

    // Métodos de pago según la región
    const paymentMethodTypes: string[] = ['card'];
    
    // Agregar PayPal solo para monedas soportadas
    if (['usd', 'eur', 'gbp'].includes(normalizedCurrency)) {
      paymentMethodTypes.push('paypal');
    }
    
    // Agregar SEPA solo para EUR
    if (normalizedCurrency === 'eur') {
      paymentMethodTypes.push('sepa_debit');
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes as Array<'card' | 'sepa_debit'>,
      line_items: [
        {
          price_data: {
            currency: normalizedCurrency,
            product_data: {
              name: productName,
              description: `${productType} - PQ Trader`,
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        productType,
        productId,
        productName,
      },
      // Habilitar múltiples monedas
      billing_address_collection: 'required',
    });

    res.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Error creando Checkout Session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error creando sesión de pago' 
    });
  }
};

// Webhook de Stripe (para recibir eventos)
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  try {
    let event: Stripe.Event;

    // Verificar firma del webhook (IMPORTANTE para seguridad)
    if (webhookSecret) {
      // req.body debe ser el raw body (string), no JSON parseado
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } else {
      console.warn('⚠️  STRIPE_WEBHOOK_SECRET no configurado. Webhooks sin verificación.');
      event = req.body;
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Pago exitoso:', paymentIntent.id);
        // Aquí: actualizar base de datos, enviar email, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Pago fallido:', failedPayment.id);
        // Aquí: notificar al usuario
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout completado:', session.id);
        // Aquí: dar acceso al producto, enviar email de confirmación
        break;

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error: any) {
    console.error('Error en webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Obtener estado de un pago
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    // Intentar obtener como Payment Intent
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);
      res.json({
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      });
      return;
    } catch {
      // Si falla, intentar como Checkout Session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json({
        success: true,
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      });
    }

  } catch (error: any) {
    console.error('Error obteniendo estado de pago:', error);
    res.status(404).json({ 
      success: false, 
      error: 'Pago no encontrado' 
    });
  }
};
