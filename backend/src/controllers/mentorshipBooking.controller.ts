import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

type BookingRequest = AuthRequest;

// Crear una reserva de mentoría
export const createMentorshipBooking = async (req: BookingRequest, res: Response) => {
  try {
    const { mentor_id, scheduled_date, start_time, end_time, title, description } = req.body;
    const student_id = req.user?.id;

    if (!student_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!mentor_id || !scheduled_date || !start_time || !end_time) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Validate date is in the future
    const selectedDate = new Date(scheduled_date);
    if (selectedDate < new Date()) {
      return res.status(400).json({ success: false, error: 'Cannot book past dates' });
    }

    // Check mentor availability
    const dayOfWeek = selectedDate.getDay();
    const { data: schedule, error: scheduleError } = await supabase
      .from('mentor_schedules')
      .select('*')
      .eq('mentor_id', mentor_id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single();

    if (scheduleError || !schedule) {
      return res.status(400).json({
        success: false,
        error: 'Mentor is not available on this day'
      });
    }

    // Check for blackout dates
    const { data: unavailable } = await supabase
      .from('mentor_unavailability')
      .select('*')
      .eq('mentor_id', mentor_id)
      .lte('start_date', scheduled_date)
      .gte('end_date', scheduled_date);

    if (unavailable && unavailable.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Mentor is unavailable on this date'
      });
    }

    // Check for existing bookings at the same time
    const scheduledDateTime = new Date(`${scheduled_date}T${start_time}`);
    const { data: existingBookings } = await supabase
      .from('mentorships')
      .select('*')
      .eq('mentor_id', mentor_id)
      .eq('status', 'scheduled')
      .gte('scheduled_at', scheduledDateTime)
      .lt('scheduled_at', new Date(scheduledDateTime.getTime() + 60 * 60 * 1000)); // 1 hour window

    if (existingBookings && existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked'
      });
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('mentorships')
      .insert({
        mentor_id,
        student_id,
        title: title || 'Sesión de Mentoría',
        description,
        scheduled_at: scheduledDateTime.toISOString(),
        time_slot_start: start_time,
        time_slot_end: end_time,
        status: 'scheduled',
        type: 'individual'
      })
      .select();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      return res.status(500).json({ success: false, error: bookingError.message });
    }

    res.status(201).json({
      success: true,
      data: booking[0],
      message: 'Mentorship booked successfully'
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener reservas del mentor
export const getMentorBookings = async (req: BookingRequest, res: Response) => {
  try {
    const mentor_id = req.params.mentor_id || req.user?.id;
    const { status, from_date, to_date } = req.query;

    if (!mentor_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Verify user is the mentor or admin
    if (req.user?.id !== mentor_id && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    let query = supabase
      .from('mentorships')
      .select(`
        *,
        student:student_id(id, name, email),
        mentor:mentor_id(id, name, email)
      `)
      .eq('mentor_id', mentor_id)
      .order('scheduled_at', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (from_date) {
      query = query.gte('scheduled_at', from_date);
    }

    if (to_date) {
      query = query.lte('scheduled_at', to_date);
    }

    const { data: bookings, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener reservas del estudiante
export const getStudentBookings = async (req: BookingRequest, res: Response) => {
  try {
    const student_id = req.user?.id;

    if (!student_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { data: bookings, error } = await supabase
      .from('mentorships')
      .select(`
        *,
        student:student_id(id, name, email),
        mentor:mentor_id(id, name, email)
      `)
      .eq('student_id', student_id)
      .order('scheduled_at', { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    console.error('Get student bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cancelar una reserva
export const cancelMentorshipBooking = async (req: BookingRequest, res: Response) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Get the booking
    const { data: booking, error: fetchError } = await supabase
      .from('mentorships')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Check if user is mentor or student of this booking
    if (booking.mentor_id !== Number(user_id) && booking.student_id !== Number(user_id)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Update booking status
    const { data: updated, error: updateError } = await supabase
      .from('mentorships')
      .update({ status: 'canceled' })
      .eq('id', booking_id)
      .select();

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError.message });
    }

    res.status(200).json({
      success: true,
      data: updated[0],
      message: 'Booking canceled successfully'
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener disponibilidad del mentor
export const getMentorAvailability = async (req: BookingRequest, res: Response) => {
  try {
    const { mentor_id, date } = req.query;

    if (!mentor_id || !date) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    const selectedDate = new Date(date as string);
    const dayOfWeek = selectedDate.getDay();

    // Get mentor schedule for the day
    const { data: schedule } = await supabase
      .from('mentor_schedules')
      .select('*')
      .eq('mentor_id', mentor_id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single();

    if (!schedule) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Mentor not available on this day'
      });
    }

    // Check for blackout dates
    const { data: unavailable } = await supabase
      .from('mentor_unavailability')
      .select('*')
      .eq('mentor_id', mentor_id)
      .lte('start_date', date)
      .gte('end_date', date);

    if (unavailable && unavailable.length > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Mentor is unavailable on this date'
      });
    }

    // Get existing bookings for the day
    const { data: existingBookings } = await supabase
      .from('mentorships')
      .select('*')
      .eq('mentor_id', mentor_id)
      .eq('status', 'scheduled')
      .gte('scheduled_at', `${date}T00:00:00`)
      .lt('scheduled_at', `${date}T23:59:59`);

    // Generate available time slots
    const availableSlots = generateAvailableSlots(
      schedule,
      existingBookings || [],
      date as string
    );

    res.status(200).json({
      success: true,
      available: true,
      schedule,
      booked_slots: existingBookings,
      available_slots: availableSlots
    });
  } catch (error: any) {
    console.error('Get availability error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

function generateAvailableSlots(
  schedule: any,
  bookings: any[],
  date: string
): string[] {
  const slots: string[] = [];
  const duration = schedule.session_duration_minutes || 60;
  
  const startTime = parseTime(schedule.start_time);
  const endTime = parseTime(schedule.end_time);
  const breakStart = schedule.break_start ? parseTime(schedule.break_start) : null;
  const breakEnd = schedule.break_end ? parseTime(schedule.break_end) : null;

  let currentTime = startTime;

  while (currentTime + duration <= endTime) {
    // Skip break time
    if (breakStart && breakEnd) {
      if (currentTime >= breakStart && currentTime < breakEnd) {
        currentTime = breakEnd;
        continue;
      }
    }

    // Check if slot is booked
    const slotStart = new Date(`${date}T${formatTime(currentTime)}`);
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    const isBooked = bookings.some((booking: any) => {
      const bookingStart = new Date(booking.scheduled_at);
      const bookingEnd = new Date(bookingStart.getTime() + (booking.duration_minutes || 60) * 60000);
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });

    if (!isBooked) {
      slots.push(formatTime(currentTime));
    }

    currentTime += duration;
  }

  return slots;
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
