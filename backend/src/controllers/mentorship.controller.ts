import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';

export const getMentorships = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: mentorships, error } = await supabase
      .from('mentorships')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: mentorships?.length || 0,
      data: mentorships
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMentorship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: mentorship, error } = await supabase
      .from('mentorships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!mentorship) {
      res.status(404).json({
        success: false,
        error: 'Mentoría no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: mentorship
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createMentorship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, duration, price, mentor_id } = req.body;

    const { data: mentorship, error } = await supabase
      .from('mentorships')
      .insert([{ title, description, duration, price, mentor_id }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: mentorship
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateMentorship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, duration, price, status } = req.body;

    const { data: mentorship, error } = await supabase
      .from('mentorships')
      .update({ title, description, duration, price, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: mentorship
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteMentorship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('mentorships')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Mentoría eliminada correctamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
