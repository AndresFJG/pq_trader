import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

// Obtener horarios del mentor
export const getMentorSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { data: schedules, error } = await supabase
      .from('mentor_schedules')
      .select('*')
      .eq('mentor_id', mentor_id)
      .order('day_of_week', { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      data: schedules
    });
  } catch (error: any) {
    console.error('Get schedules error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear o actualizar horario del mentor
export const upsertMentorSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;
    const { day_of_week, start_time, end_time, max_sessions_per_day, session_duration_minutes, break_start, break_end } = req.body;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if schedule exists for this day
    const { data: existing } = await supabase
      .from('mentor_schedules')
      .select('id')
      .eq('mentor_id', mentor_id)
      .eq('day_of_week', day_of_week)
      .single();

    let result, error;

    if (existing) {
      // Update existing
      ({ data: result, error } = await supabase
        .from('mentor_schedules')
        .update({
          start_time,
          end_time,
          max_sessions_per_day,
          session_duration_minutes,
          break_start,
          break_end,
          updated_at: new Date().toISOString()
        })
        .eq('mentor_id', mentor_id)
        .eq('day_of_week', day_of_week)
        .select());
    } else {
      // Insert new
      ({ data: result, error } = await supabase
        .from('mentor_schedules')
        .insert({
          mentor_id,
          day_of_week,
          start_time,
          end_time,
          max_sessions_per_day,
          session_duration_minutes,
          break_start,
          break_end
        })
        .select());
    }

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      data: result[0],
      message: 'Schedule saved successfully'
    });
  } catch (error: any) {
    console.error('Upsert schedule error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Activar/desactivar horario
export const toggleMentorSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;
    const { schedule_id, is_active } = req.body;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Verify ownership
    const { data: schedule, error: fetchError } = await supabase
      .from('mentor_schedules')
      .select('*')
      .eq('id', schedule_id)
      .single();

    if (fetchError || !schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }

    if (schedule.mentor_id !== Number(mentor_id)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { data: updated, error: updateError } = await supabase
      .from('mentor_schedules')
      .update({ is_active })
      .eq('id', schedule_id)
      .select();

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError.message });
    }

    res.status(200).json({
      success: true,
      data: updated[0],
      message: `Schedule ${is_active ? 'activated' : 'deactivated'}`
    });
  } catch (error: any) {
    console.error('Toggle schedule error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Agregar período de no disponibilidad
export const addUnavailability = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;
    const { start_date, end_date, reason } = req.body;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const { data: unavailability, error } = await supabase
      .from('mentor_unavailability')
      .insert({
        mentor_id,
        start_date,
        end_date,
        reason
      })
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      data: unavailability[0],
      message: 'Unavailability period added'
    });
  } catch (error: any) {
    console.error('Add unavailability error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener períodos de no disponibilidad
export const getUnavailability = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { data: unavailability, error } = await supabase
      .from('mentor_unavailability')
      .select('*')
      .eq('mentor_id', mentor_id)
      .order('start_date', { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      data: unavailability
    });
  } catch (error: any) {
    console.error('Get unavailability error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar período de no disponibilidad
export const removeUnavailability = async (req: AuthRequest, res: Response) => {
  try {
    const mentor_id = req.user?.id;
    const { unavailability_id } = req.params;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Verify ownership
    const { data: unavailability } = await supabase
      .from('mentor_unavailability')
      .select('*')
      .eq('id', unavailability_id)
      .single();

    if (!unavailability || unavailability.mentor_id !== Number(mentor_id)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { error } = await supabase
      .from('mentor_unavailability')
      .delete()
      .eq('id', unavailability_id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      message: 'Unavailability period removed'
    });
  } catch (error: any) {
    console.error('Remove unavailability error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
