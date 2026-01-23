import { Router } from 'express';
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  bookSession,
  getMyBookings,
  cancelBooking,
} from '../controllers/mentorshipSession.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

/**
 * @route   GET /api/mentorships/:mentorshipId/sessions
 * @desc    Obtener sesiones de una mentoría
 * @access  Public
 */
router.get('/', getSessions);

/**
 * @route   POST /api/mentorships/:mentorshipId/sessions
 * @desc    Crear una nueva sesión
 * @access  Private (Admin)
 */
router.post('/', protect, authorize('admin'), createSession);

/**
 * @route   PUT /api/mentorships/:mentorshipId/sessions/:sessionId
 * @desc    Actualizar una sesión
 * @access  Private (Admin)
 */
router.put('/:sessionId', protect, authorize('admin'), updateSession);

/**
 * @route   DELETE /api/mentorships/:mentorshipId/sessions/:sessionId
 * @desc    Eliminar una sesión
 * @access  Private (Admin)
 */
router.delete('/:sessionId', protect, authorize('admin'), deleteSession);

/**
 * @route   POST /api/mentorships/sessions/:sessionId/book
 * @desc    Reservar una sesión
 * @access  Private
 */
router.post('/sessions/:sessionId/book', protect, bookSession);

/**
 * @route   GET /api/mentorships/bookings/my-bookings
 * @desc    Obtener mis reservas
 * @access  Private
 */
router.get('/bookings/my-bookings', protect, getMyBookings);

/**
 * @route   DELETE /api/mentorships/bookings/:bookingId
 * @desc    Cancelar una reserva
 * @access  Private
 */
router.delete('/bookings/:bookingId', protect, cancelBooking);

export default router;
