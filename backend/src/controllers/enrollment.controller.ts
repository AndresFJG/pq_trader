import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * @desc    Obtener cursos comprados por el usuario
 * @route   GET /api/enrollments/my-courses
 * @access  Private
 */
export const getMyCourses = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, error: 'No autorizado' });
    return;
  }

  logger.info('Fetching courses for user', { userId });

  // Obtener enrollments del usuario con información del curso
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        description,
        thumbnail,
        level,
        duration_hours,
        price,
        enrollment_count,
        rating,
        category
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  if (enrollError) {
    logger.error('Error fetching enrollments', { error: enrollError.message, userId });
    throw enrollError;
  }

  logger.info('Enrollments found', { count: enrollments?.length || 0, userId });

  if (!enrollments || enrollments.length === 0) {
    res.json({
      success: true,
      data: [],
      message: 'No tienes cursos inscritos todavía',
    });
    return;
  }

  // Mapear enrollments a formato esperado con información adicional
  const coursesWithProgress = enrollments.map(enrollment => ({
    ...enrollment.courses,
    enrollmentId: enrollment.id,
    progress: enrollment.progress || 0,
    enrolledAt: enrollment.enrolled_at,
    status: enrollment.status,
  }));

  logger.info('User courses retrieved', { 
      userId, 
      count: coursesWithProgress.length,
      courses: coursesWithProgress.map(c => ({ id: c.id, title: c.title }))
    });

  res.json({
    success: true,
    data: coursesWithProgress,
  });
});

/**
 * @desc    Obtener progreso del usuario en todos sus cursos
 * @route   GET /api/enrollments/progress
 * @access  Private
 */
export const getMyProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'No autorizado' });
      return;
    }

    // TODO: Implementar tabla de progreso en la BD
    // Por ahora retornar progreso vacío
    res.json({
      success: true,
      data: {
        totalCourses: 0,
        completedCourses: 0,
        totalProgress: 0,
        hoursThisWeek: 0,
        lessonsCompleted: 0,
      },
    });
  } catch (error: any) {
    logger.error('Get progress error', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener progreso',
    });
  }
};
