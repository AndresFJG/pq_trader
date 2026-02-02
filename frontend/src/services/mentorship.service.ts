import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mentorshipBookingService = {
  // Student endpoints
  bookSession: (data: {
    mentor_id: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    title?: string;
    description?: string;
  }) => api.post('/mentorship-bookings/book', data),

  getMyBookings: (params?: any) =>
    api.get('/mentorship-bookings/my-bookings', { params }),

  cancelBooking: (bookingId: string) =>
    api.delete(`/mentorship-bookings/${bookingId}`),

  // Mentor endpoints
  getMentorBookings: (mentorId?: string, params?: any) =>
    api.get(`/mentorship-bookings/${mentorId || 'my'}/bookings`, { params }),

  // Public endpoints
  getMentorAvailability: (mentorId: string, date: string) =>
    api.get('/mentorship-bookings/availability', {
      params: { mentor_id: mentorId, date }
    })
};

export const mentorScheduleService = {
  // Schedule management
  getSchedules: () => api.get('/mentor-schedules/schedules'),

  upsertSchedule: (data: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    max_sessions_per_day?: number;
    session_duration_minutes?: number;
    break_start?: string;
    break_end?: string;
  }) => api.post('/mentor-schedules/schedules', data),

  toggleSchedule: (scheduleId: string, isActive: boolean) =>
    api.patch('/mentor-schedules/schedules/toggle', {
      schedule_id: scheduleId,
      is_active: isActive
    }),

  // Unavailability management
  getUnavailability: () => api.get('/mentor-schedules/unavailability'),

  addUnavailability: (data: {
    start_date: string;
    end_date: string;
    reason?: string;
  }) => api.post('/mentor-schedules/unavailability', data),

  removeUnavailability: (unavailabilityId: string) =>
    api.delete(`/mentor-schedules/unavailability/${unavailabilityId}`)
};

export default {
  mentorshipBookingService,
  mentorScheduleService
};
