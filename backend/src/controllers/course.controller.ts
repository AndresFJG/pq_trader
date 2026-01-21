import { Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error: any) {
    logger.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener cursos',
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', req.params.id)
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
    logger.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener el curso',
    });
  }
};

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
export const enrollCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement enrollments table
    res.status(501).json({
      success: false,
      error: 'Funcionalidad pendiente de implementar',
    });
  } catch (error: any) {
    logger.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al inscribirse en el curso',
    });
  }
};
