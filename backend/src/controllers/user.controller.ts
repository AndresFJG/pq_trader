import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { asyncHandler } from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { data: users, error, count } = await supabase
    .from('users')
    .select('id, name, email, role, subscription_tier, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({
    success: true,
    count: users?.length || 0,
    total: count || 0,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: (count || 0) > offset + limit
    },
    data: users
  });
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, subscription_tier, created_at')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
    return;
  }

  res.json({
    success: true,
    data: user
  });
});

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, subscription_tier } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, email, role, subscription_tier })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
