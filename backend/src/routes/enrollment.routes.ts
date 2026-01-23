import { Router } from 'express';
import { getMyCourses, getMyProgress } from '../controllers/enrollment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/enrollments/my-courses
 * @desc    Obtener cursos comprados por el usuario
 * @access  Private
 */
router.get('/my-courses', protect, getMyCourses);

/**
 * @route   GET /api/enrollments/progress
 * @desc    Obtener progreso del usuario
 * @access  Private
 */
router.get('/progress', protect, getMyProgress);

export default router;
