import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';

export const getPortfolios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: portfolios?.length || 0,
      data: portfolios
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getFeaturedPortfolios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('status', 'active')
      .order('roi', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: portfolios?.length || 0,
      data: portfolios
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!portfolio) {
      res.status(404).json({
        success: false,
        error: 'Portafolio no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { user_id, title, description, strategy, performance } = req.body;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert([{ user_id, title, description, strategy, performance }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: portfolio
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updatePortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, strategy, performance, status } = req.body;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .update({ title, description, strategy, performance, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deletePortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Portafolio eliminado correctamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMyPortfolios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
      return;
    }

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: portfolios?.length || 0,
      data: portfolios
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
