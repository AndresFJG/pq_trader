import crypto from 'crypto';
import { logger, logTransaction } from '../utils/logger';
// Import PayPal SDK
import paypal from '@paypal/paypal-server-sdk';

const environment =
  process.env.PAYPAL_MODE === 'production'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      );

const client = new paypal.core.PayPalHttpClient(environment);

class PayPalService {
  /**
   * Crear orden de PayPal
   */
  async createOrder(
    amount: number,
    currency: string,
    metadata?: any
  ): Promise<any> {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            invoice_id: `INV-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
            custom_id: metadata?.userId || '',
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          brand_name: 'PQ Trader',
          user_action: 'PAY_NOW',
        },
      });

      const response = await client.execute(request);

      logTransaction('PAYPAL_ORDER_CREATED', {
        orderId: response.result.id,
        amount,
        currency,
      });

      return response.result;
    } catch (error: any) {
      logger.error('PayPal create order error', { error: error.message });
      throw new Error(`Failed to create PayPal order: ${error.message}`);
    }
  }

  /**
   * Capturar pago de PayPal
   */
  async captureOrder(orderId: string): Promise<any> {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const response = await client.execute(request);

      logTransaction('PAYPAL_ORDER_CAPTURED', {
        orderId,
        captureId: response.result.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        status: response.result.status,
      });

      return response.result;
    } catch (error: any) {
      logger.error('PayPal capture order error', {
        error: error.message,
        orderId,
      });
      throw new Error(`Failed to capture PayPal order: ${error.message}`);
    }
  }

  /**
   * Obtener detalles de orden
   */
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await client.execute(request);
      return response.result;
    } catch (error: any) {
      logger.error('PayPal get order details error', {
        error: error.message,
        orderId,
      });
      throw new Error(`Failed to get PayPal order details: ${error.message}`);
    }
  }

  /**
   * Reembolsar pago
   */
  async refundPayment(
    captureId: string,
    amount?: number,
    currency?: string
  ): Promise<any> {
    try {
      const request = new paypal.payments.CapturesRefundRequest(captureId);
      
      if (amount && currency) {
        request.requestBody({
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        });
      }

      const response = await client.execute(request);

      logTransaction('PAYPAL_REFUND_CREATED', {
        captureId,
        refundId: response.result.id,
        amount: amount || 'full',
      });

      return response.result;
    } catch (error: any) {
      logger.error('PayPal refund error', {
        error: error.message,
        captureId,
      });
      throw new Error(`Failed to refund PayPal payment: ${error.message}`);
    }
  }

  /**
   * Verificar firma de webhook
   */
  async verifyWebhookSignature(
    headers: any,
    body: any,
    webhookId: string
  ): Promise<boolean> {
    try {
      const request = new paypal.notifications.VerifyWebhookSignatureRequest();
      request.requestBody({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: body,
      });

      const response = await client.execute(request);
      return response.result.verification_status === 'SUCCESS';
    } catch (error: any) {
      logger.error('PayPal webhook verification error', {
        error: error.message,
      });
      return false;
    }
  }
}

export default new PayPalService();
