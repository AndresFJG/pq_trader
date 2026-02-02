import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import TransactionService from '../services/transaction.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { data: transactions, error, count } = await supabase
    .from('transactions')
    .select(`
      *,
      users (
        id,
        name,
        email
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

    // Enriquecer con nombres de productos si no están en la columna
    const enrichedTransactions = await Promise.all(
      (transactions || []).map(async (transaction) => {
        // Si ya tiene product_name, usarlo
        if (transaction.product_name) {
          return transaction;
        }

        // Si no, intentar obtenerlo desde metadata o base de datos
        const productId = transaction.product_id || transaction.metadata?.productId;
        const productType = transaction.product_type || transaction.metadata?.productType;

        if (productId && productType === 'course') {
          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', productId)
            .single();
          
          if (course) {
            return {
              ...transaction,
              product_name: course.title,
              product_type: 'course',
            };
          }
        } else if (productId && productType === 'mentorship') {
          const { data: mentorship } = await supabase
            .from('mentorships')
            .select('title')
            .eq('id', productId)
            .single();
          
          if (mentorship) {
            return {
              ...transaction,
              product_name: mentorship.title,
              product_type: 'mentorship',
            };
          }
        }

        return transaction;
      })
    );

    res.json({
      success: true,
      count: enrichedTransactions?.length || 0,
      total: count || 0,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (count || 0) > offset + limit
      },
      data: enrichedTransactions || [],
    });
});

export const getUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
      return;
    }

    const transactions = await TransactionService.getUserTransactions(userId, limit);

    res.json({
      success: true,
      count: transactions?.length || 0,
      data: transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!transaction) {
      res.status(404).json({
        success: false,
        error: 'Transacción no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
