/**
 * PayPal Service - Stub temporal
 * TODO: Implementar completamente con SDK actualizado
 */

export class PayPalService {
  static async createOrder(data: any): Promise<any> {
    throw new Error('PayPal service not implemented yet');
  }
  
  static async captureOrder(orderId: string): Promise<any> {
    throw new Error('PayPal service not implemented yet');
  }
  
  static async createSubscription(data: any): Promise<any> {
    throw new Error('PayPal service not implemented yet');
  }
  
  static async cancelSubscription(subscriptionId: string): Promise<any> {
    throw new Error('PayPal service not implemented yet');
  }
  
  static async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    return false;
  }
}
