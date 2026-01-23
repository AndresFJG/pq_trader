import { Router } from 'express';
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true }); // Para acceder a :courseId

/**
 * @route   GET /api/courses/:courseId/lessons
 * @desc    Obtener todas las lecciones de un curso
 * @access  Public
 */
router.get('/', getLessons);

/**
 * @route   POST /api/courses/:courseId/lessons
 * @desc    Crear una nueva lección
 * @access  Private (Admin)
 */
router.post('/', protect, authorize('admin'), createLesson);

/**
 * @route   PUT /api/courses/:courseId/lessons/:lessonId
 * @desc    Actualizar una lección
 * @access  Private (Admin)
 */
router.put('/:lessonId', protect, authorize('admin'), updateLesson);

/**
 * @route   DELETE /api/courses/:courseId/lessons/:lessonId
 * @desc    Eliminar una lección
 * @access  Private (Admin)
 */
router.delete('/:lessonId', protect, authorize('admin'), deleteLesson);

export default router;
