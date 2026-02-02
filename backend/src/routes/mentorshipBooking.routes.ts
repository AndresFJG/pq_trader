import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import {
  createMentorshipBooking,
  getMentorBookings,
  getStudentBookings,
  cancelMentorshipBooking,
  getMentorAvailability
} from '../controllers/mentorshipBooking.controller';

const router = Router();

// Public routes
router.get('/availability', getMentorAvailability as any);

// Protected routes - Students (cast to any to fix TypeScript strict checking)
router.post('/book', protect, createMentorshipBooking as any);
router.get('/my-bookings', protect, getStudentBookings as any);

// Protected routes - Mentors
router.get('/:mentor_id/bookings', protect, getMentorBookings as any);
router.delete('/:booking_id', protect, cancelMentorshipBooking as any);
  
export default router;
