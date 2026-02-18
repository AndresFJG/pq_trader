import { Response } from 'express';
import { supabase } from '../config/supabase';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('courses')
    .select('id, title, slug, description, category, level, duration_hours, thumbnail, price, discount_price, is_published, enrollment_count, rating, created_at', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({
    success: true,
    count: data?.length || 0,
    total: count || 0,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: (count || 0) > offset + limit
    },
    data: data || [],
  });
});

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, description, category, level, thumbnail, price, discount_price, enrollment_count, rating')
    .eq('is_published', true)
    .order('enrollment_count', { ascending: false })
    .limit(3);

  if (error) throw error;

  res.json({
    success: true,
    count: data?.length || 0,
    data: data || [],
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const identifier = req.params.id;
  
  // Intentar buscar por ID (número) o por slug (string)
  let query = supabase.from('courses').select('*');
  
  // Si es un número, buscar por ID, si no, por slug
  if (!isNaN(Number(identifier))) {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('slug', identifier);
  }
  
  const { data, error } = await query.single();

  if (error) throw error;

  if (!data) {
    res.status(404).json({
      success: false,
      error: 'Curso no encontrado',
    });
    return;
  }

  res.json({
    success: true,
    data,
  });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    // Crear notificación de nuevo curso (para administradores)
    // NOTA: No pasar related_id porque course.id es INTEGER, no UUID
    await NotificationService.create({
      type: 'new_course',
      title: 'Nuevo curso publicado',
      message: `El curso "${data.title}" ha sido publicado`,
      metadata: {
        course_id: data.id,
        course_title: data.title,
        course_price: data.price,
        course_level: data.level,
        created_by_admin_id: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear el curso',
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      res.status(404).json({
        success: false,
        error: 'Curso no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar el curso',
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    logger.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar el curso',
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
// NOTA: Esta funcionalidad está deshabilitada porque los enrollments se crean
// automáticamente vía webhooks de Stripe/PayPal después del pago exitoso
export const enrollCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(400).json({
      success: false,
      error: 'Los enrollments se crean automáticamente después del pago. Por favor, utiliza el sistema de checkout.',
    });
  } catch (error: any) {
    logger.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al inscribirse en el curso',
    });
  }
};

// @desc    Get course statistics (public stats for courses page)
// @route   GET /api/courses/stats
// @access  Public
export const getCourseStats = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
  // Obtener total de cursos publicados
  const { count: activeCourses, error: countError } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  if (countError) throw countError;

  // Obtener suma de enrollment_count y duration_hours de cursos publicados
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select('enrollment_count, duration_hours')
    .eq('is_published', true);

  if (coursesError) throw coursesError;

  // Calcular totales
  const totalStudents = coursesData?.reduce((sum, course) => sum + (course.enrollment_count || 0), 0) || 0;
  const totalHours = coursesData?.reduce((sum, course) => sum + (course.duration_hours || 0), 0) || 0;

  res.json({
    success: true,
    data: {
      activeCourses: activeCourses || 0,
      totalStudents,
      totalHours,
    },
  });
});
