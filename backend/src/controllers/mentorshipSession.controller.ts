import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * @desc    Obtener sesiones de una mentoría
 * @route   GET /api/mentorships/:mentorshipId/sessions
 * @access  Public
 */
export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mentorshipId } = req.params;
    const { status } = req.query;

    let query = supabase
      .from('mentorship_sessions')
      .select('*')
      .eq('mentorship_id', mentorshipId)
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: sessions || [],
    });
  } catch (error: any) {
    logger.error('Get sessions error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener sesiones',
    });
  }
};

/**
 * @desc    Crear sesión de mentoría (Admin)
 * @route   POST /api/mentorships/:mentorshipId/sessions
 * @access  Private (Admin)
 */
export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mentorshipId } = req.params;
    const { title, description, session_date, start_time, end_time, duration_minutes, max_participants, meeting_link } = req.body;

    const { data: session, error } = await supabase
      .from('mentorship_sessions')
      .insert({
        mentorship_id: mentorshipId,
        title,
        description,
        session_date,
        start_time,
        end_time,
        duration_minutes,
        max_participants: max_participants || 1,
        meeting_link,
        status: 'available',
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Session created', { sessionId: session.id, mentorshipId });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    logger.error('Create session error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear sesión',
    });
  }
};

/**
 * @desc    Actualizar sesión (Admin)
 * @route   PUT /api/mentorships/:mentorshipId/sessions/:sessionId
 * @access  Private (Admin)
 */
export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const updateData = { ...req.body, updated_at: new Date().toISOString() };

    const { data: session, error } = await supabase
      .from('mentorship_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    logger.error('Update session error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar sesión',
    });
  }
};

/**
 * @desc    Eliminar sesión (Admin)
 * @route   DELETE /api/mentorships/:mentorshipId/sessions/:sessionId
 * @access  Private (Admin)
 */
export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const { error } = await supabase
      .from('mentorship_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Sesión eliminada correctamente',
    });
  } catch (error: any) {
    logger.error('Delete session error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar sesión',
    });
  }
};

/**
 * @desc    Reservar una sesión (Usuario)
 * @route   POST /api/mentorships/sessions/:sessionId/book
 * @access  Private
 */
export const bookSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const { notes } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    // Verificar que la sesión existe y está disponible
    const { data: session, error: sessionError } = await supabase
      .from('mentorship_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ success: false, error: 'Sesión no encontrada' });
      return;
    }

    if (session.status !== 'available') {
      res.status(400).json({ success: false, error: 'Sesión no disponible' });
      return;
    }

    if (session.current_participants >= session.max_participants) {
      res.status(400).json({ success: false, error: 'Sesión completa' });
      return;
    }

    // Crear la reserva
    const { data: booking, error: bookingError } = await supabase
      .from('mentorship_bookings')
      .insert({
        session_id: sessionId,
        user_id: userId,
        notes,
        status: 'confirmed',
      })
      .select()
      .single();

    if (bookingError) {
      if (bookingError.code === '23505') {
        res.status(400).json({ success: false, error: 'Ya tienes una reserva para esta sesión' });
        return;
      }
      throw bookingError;
    }

    logger.info('Session booked', { bookingId: booking.id, sessionId, userId });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Sesión reservada exitosamente',
    });
  } catch (error: any) {
    logger.error('Book session error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al reservar sesión',
    });
  }
};

/**
 * @desc    Obtener mis reservas
 * @route   GET /api/mentorships/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const { data: bookings, error } = await supabase
      .from('mentorship_bookings')
      .select(`
        *,
        mentorship_sessions (
          *,
          mentorships (
            title,
            description,
            type
          )
        )
      `)
      .eq('user_id', userId)
      .order('booked_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: bookings || [],
    });
  } catch (error: any) {
    logger.error('Get my bookings error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener reservas',
    });
  }
};

/**
 * @desc    Cancelar reserva
 * @route   DELETE /api/mentorships/bookings/:bookingId
 * @access  Private
 */
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.id;

    const { data: booking, error } = await supabase
      .from('mentorship_bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!booking) {
      res.status(404).json({ success: false, error: 'Reserva no encontrada' });
      return;
    }

    res.json({
      success: true,
      message: 'Reserva cancelada correctamente',
    });
  } catch (error: any) {
    logger.error('Cancel booking error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al cancelar reserva',
    });
  }
};
