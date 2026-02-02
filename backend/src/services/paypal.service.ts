/**
 * PayPal Service - Implementación real con PayPal SDK
 */
import axios from 'axios';
import { logger } from '../utils/logger';

interface PayPalOrderData {
  amount: number;
  currency?: string;
  userId?: string;
  plan?: string;
  email?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

interface PayPalSubscriptionData {
  plan_id: string;
  userId?: string;
  email?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private mode: 'sandbox' | 'live';
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.mode = (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox';
    this.baseUrl = this.mode === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

    if (!this.clientId || !this.clientSecret) {
      logger.warn('PayPal credentials not configured');
    }
  }

  /**
   * Obtener token de acceso de PayPal
   */
  private async getAccessToken(): Promise<string> {
    // Si el token aún es válido, reutilizarlo
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Expirar 5 minutos antes del tiempo real
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      
      return this.accessToken;
    } catch (error: any) {
      logger.error('Error getting PayPal access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  /**
   * Crear orden de pago
   */
  async createOrder(data: PayPalOrderData): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      // URLs de retorno
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const returnUrl = data.returnUrl || `${frontendUrl}/checkout/paypal-return`;
      const cancelUrl = data.cancelUrl || `${frontendUrl}/checkout/paypal-cancel`;
      
      // PayPal solo soporta ciertas monedas (USD, EUR, GBP, CAD, AUD, JPY, MXN)
      // Si la moneda no es soportada, convertir a USD
      const supportedPayPalCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'MXN'];
      const requestedCurrency = (data.currency || 'EUR').toUpperCase();
      const finalCurrency = supportedPayPalCurrencies.includes(requestedCurrency) 
        ? requestedCurrency 
        : 'USD'; // Default a USD si la moneda no es soportada

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: finalCurrency,
              value: data.amount.toFixed(2),
            },
            description: data.plan || 'PQ Trader Payment',
            custom_id: data.userId,
          },
        ],
        application_context: {
          brand_name: 'PQ Trader',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('PayPal order created:', { orderId: response.data.id });
      return response.data;
    } catch (error: any) {
      logger.error('Error creating PayPal order:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create PayPal order');
    }
  }

  /**
   * Capturar pago de orden
   */
  async captureOrder(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('PayPal order captured:', { orderId, status: response.data.status });
      return response.data;
    } catch (error: any) {
      logger.error('Error capturing PayPal order:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to capture PayPal payment');
    }
  }

  /**
   * Obtener detalles de orden
   */
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Error getting PayPal order details:', error.response?.data || error.message);
      throw new Error('Failed to get order details');
    }
  }

  /**
   * Crear suscripción
   */
  async createSubscription(data: PayPalSubscriptionData): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const subscriptionData = {
        plan_id: data.plan_id,
        application_context: {
          brand_name: 'PQ Trader',
          user_action: 'SUBSCRIBE_NOW',
          return_url: data.returnUrl || `${process.env.FRONTEND_URL}/checkout/success`,
          cancel_url: data.cancelUrl || `${process.env.FRONTEND_URL}/checkout/cancel`,
        },
        subscriber: {
          email_address: data.email,
        },
        custom_id: data.userId,
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions`,
        subscriptionData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('PayPal subscription created:', { subscriptionId: response.data.id });
      return response.data;
    } catch (error: any) {
      logger.error('Error creating PayPal subscription:', error.response?.data || error.message);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Cancelar suscripción
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        {
          reason: reason || 'Customer request',
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('PayPal subscription cancelled:', { subscriptionId });
      return response.data;
    } catch (error: any) {
      logger.error('Error cancelling PayPal subscription:', error.response?.data || error.message);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Reembolsar pago
   */
  async refundPayment(captureId: string, amount?: { value: string; currency_code: string }): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const refundData = amount ? { amount } : {};

      const response = await axios.post(
        `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('PayPal refund processed:', { captureId, refundId: response.data.id });
      return response.data;
    } catch (error: any) {
      logger.error('Error processing PayPal refund:', error.response?.data || error.message);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Verificar firma de webhook
   */
  async verifyWebhookSignature(
    webhookId: string,
    headers: any,
    body: any
  ): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();

      const verificationData = {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: body,
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.verification_status === 'SUCCESS';
    } catch (error: any) {
      logger.error('Error verifying PayPal webhook:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Verificar webhook (backward compatibility)
   */
  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    // En producción, deberías tener un webhook ID configurado
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    if (!webhookId) {
      logger.warn('PayPal webhook ID not configured, skipping verification');
      return true; // En desarrollo
    }

    return this.verifyWebhookSignature(webhookId, headers, payload);
  }
}

export default new PayPalService();
