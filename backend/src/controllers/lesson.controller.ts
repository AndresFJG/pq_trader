import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * @desc    Obtener todas las lecciones de un curso
 * @route   GET /api/courses/:courseId/lessons
 * @access  Public
 */
export const getLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    logger.info('Lessons retrieved', { courseId, count: lessons?.length });

    res.json({
      success: true,
      data: lessons || [],
    });
  } catch (error: any) {
    logger.error('Get lessons error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener lecciones',
    });
  }
};

/**
 * @desc    Crear una nueva lección
 * @route   POST /api/courses/:courseId/lessons
 * @access  Private (Admin)
 */
export const createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, video_url, content, order_index, is_free } = req.body;

    // Validar que el curso existe
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      res.status(404).json({ success: false, error: 'Curso no encontrado' });
      return;
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        title,
        description,
        duration,
        video_url,
        content,
        order_index,
        is_free: is_free || false,
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Lesson created', { lessonId: lesson.id, courseId });

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (error: any) {
    logger.error('Create lesson error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear lección',
    });
  }
};

/**
 * @desc    Actualizar una lección
 * @route   PUT /api/courses/:courseId/lessons/:lessonId
 * @access  Private (Admin)
 */
export const updateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, description, duration, video_url, content, order_index, is_free } = req.body;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update({
        title,
        description,
        duration,
        video_url,
        content,
        order_index,
        is_free,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .select()
      .single();

    if (error) throw error;

    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lección no encontrada' });
      return;
    }

    logger.info('Lesson updated', { lessonId, courseId });

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error: any) {
    logger.error('Update lesson error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar lección',
    });
  }
};

/**
 * @desc    Eliminar una lección
 * @route   DELETE /api/courses/:courseId/lessons/:lessonId
 * @access  Private (Admin)
 */
export const deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)
      .eq('course_id', courseId);

    if (error) throw error;

    logger.info('Lesson deleted', { lessonId, courseId });

    res.json({
      success: true,
      message: 'Lección eliminada correctamente',
    });
  } catch (error: any) {
    logger.error('Delete lesson error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar lección',
    });
  }
};
