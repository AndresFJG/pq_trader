/**
 * Transaction Service - Manejo de transacciones en Supabase
 */
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

interface CreateTransactionData {
  userId: number;
  amount: number;
  currency: string;
  type: 'stripe' | 'paypal' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  subscriptionId?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  productId?: string;
  productName?: string;
  productType?: string;
  metadata?: any;
}

export class TransactionService {
  /**
   * Crear nueva transacción
   */
  static async createTransaction(data: CreateTransactionData) {
    try {
      const transactionData: any = {
        user_id: data.userId,
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        type: data.type,
        status: data.status,
        payment_intent_id: data.paymentIntentId || null,
        subscription_id: data.subscriptionId || null,
        paypal_order_id: data.paypalOrderId || null,
        paypal_capture_id: data.paypalCaptureId || null,
        metadata: {
          productId: data.productId,
          productName: data.productName,
          productType: data.productType,
          ...data.metadata,
        },
        paid_at: data.status === 'completed' ? new Date().toISOString() : null,
      };

      // Intentar agregar las nuevas columnas si existen (después de migración 008)
      if (data.productId) {
        transactionData.product_id = parseInt(data.productId);
      }
      if (data.productName) {
        transactionData.product_name = data.productName;
      }
      if (data.productType) {
        transactionData.product_type = data.productType;
      }

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating transaction:', error);
        throw new Error(`Failed to create transaction: ${error.message}`);
      }

      logger.info('Transaction created successfully', {
        transactionId: transaction.id,
        userId: data.userId,
        amount: data.amount,
        type: data.type,
      });

      return transaction;
    } catch (error: any) {
      logger.error('Transaction creation error:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de transacción
   */
  static async updateTransactionStatus(
    transactionId: number,
    status: 'completed' | 'failed' | 'refunded',
    metadata?: any
  ) {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'completed') {
        updateData.paid_at = new Date().toISOString();
      } else if (status === 'refunded') {
        updateData.refunded_at = new Date().toISOString();
      }

      if (metadata) {
        // Obtener metadata actual y combinarla
        const { data: existing } = await supabase
          .from('transactions')
          .select('metadata')
          .eq('id', transactionId)
          .single();

        updateData.metadata = {
          ...(existing?.metadata || {}),
          ...metadata,
        };
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating transaction:', error);
        throw new Error(`Failed to update transaction: ${error.message}`);
      }

      logger.info('Transaction updated', {
        transactionId,
        status,
      });

      return data;
    } catch (error: any) {
      logger.error('Transaction update error:', error);
      throw error;
    }
  }

  /**
   * Obtener transacción por PayPal Order ID
   */
  static async getByPayPalOrderId(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('paypal_order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        logger.error('Error fetching transaction by PayPal order:', error);
        throw new Error(`Failed to fetch transaction: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      logger.error('Get transaction by PayPal order error:', error);
      throw error;
    }
  }

  /**
   * Obtener transacciones de un usuario
   */
  static async getUserTransactions(userId: number, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching user transactions:', error);
        throw new Error(`Failed to fetch transactions: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      logger.error('Get user transactions error:', error);
      throw error;
    }
  }

  /**
   * Calcular ingresos totales
   */
  static async getTotalRevenue() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

      if (error) {
        logger.error('Error calculating revenue:', error);
        throw new Error(`Failed to calculate revenue: ${error.message}`);
      }

      const total = data?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      return total;
    } catch (error: any) {
      logger.error('Calculate revenue error:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de transacciones
   */
  static async getStats() {
    try {
      const { data: all, error: allError } = await supabase
        .from('transactions')
        .select('amount, status, type');

      if (allError) throw allError;

      const stats = {
        total: all?.length || 0,
        completed: all?.filter(t => t.status === 'completed').length || 0,
        pending: all?.filter(t => t.status === 'pending').length || 0,
        failed: all?.filter(t => t.status === 'failed').length || 0,
        revenue: all
          ?.filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0,
        byType: {
          stripe: all?.filter(t => t.type === 'stripe').length || 0,
          paypal: all?.filter(t => t.type === 'paypal').length || 0,
          other: all?.filter(t => t.type === 'other').length || 0,
        },
      };

      return stats;
    } catch (error: any) {
      logger.error('Get transaction stats error:', error);
      throw error;
    }
  }

  /**
   * Auto-cancelar transacciones pendientes antiguas (>30 minutos)
   */
  static async cancelExpiredPendingTransactions() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      const { data: expired, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .lt('created_at', thirtyMinutesAgo);

      if (error) throw error;

      if (expired && expired.length > 0) {
        const cancelledIds = [];

        for (const transaction of expired) {
          await this.updateTransactionStatus(transaction.id, 'failed', {
            cancelReason: 'Expired - No payment completed within 30 minutes',
            cancelledAt: new Date().toISOString(),
          });
          cancelledIds.push(transaction.id);
        }

        logger.info('Auto-cancelled expired pending transactions', {
          count: cancelledIds.length,
          transactionIds: cancelledIds,
        });

        return cancelledIds.length;
      }

      return 0;
    } catch (error: any) {
      logger.error('Cancel expired transactions error:', error);
      throw error;
    }
  }
}

export default TransactionService;
