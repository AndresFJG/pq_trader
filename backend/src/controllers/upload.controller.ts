import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * @desc    Subir archivo a Supabase Storage
 * @route   POST /api/upload/lesson-media
 * @access  Private (Admin)
 */
export const uploadLessonMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No se ha proporcionado ningún archivo'
      });
      return;
    }

    const file = req.file;
    
    // Generar nombre único para el archivo
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    const filePath = `lessons/${fileName}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('lesson-media')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      logger.error('Supabase Storage upload error', { error: error.message });
      res.status(500).json({
        success: false,
        error: `Error al subir archivo a Supabase Storage: ${error.message}`
      });
      return;
    }

    // Obtener URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from('lesson-media')
      .getPublicUrl(filePath);

    const fileInfo = {
      filename: fileName,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: publicUrlData.publicUrl,
      path: filePath,
    };

    logger.info('File uploaded to Supabase Storage', { 
      filename: fileName, 
      size: file.size,
      userId: req.user?.id 
    });

    res.status(201).json({
      success: true,
      data: fileInfo,
      message: 'Archivo subido correctamente a Supabase Storage'
    });
  } catch (error: any) {
    logger.error('Upload error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Error al subir el archivo'
    });
  }
};

/**
 * @desc    Eliminar archivo de Supabase Storage
 * @route   DELETE /api/upload/lesson-media/:filename
 * @access  Private (Admin)
 */
export const deleteLessonMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;

    if (!filename) {
      res.status(400).json({
        success: false,
        error: 'Nombre de archivo no proporcionado'
      });
      return;
    }

    const filePath = `lessons/${filename}`;

    // Eliminar de Supabase Storage
    const { error } = await supabase.storage
      .from('lesson-media')
      .remove([filePath]);

    if (error) {
      logger.error('Supabase Storage delete error', { error: error.message });
      res.status(500).json({
        success: false,
        error: `Error al eliminar archivo: ${error.message}`
      });
      return;
    }

    logger.info('File deleted from Supabase Storage', { 
      filename,
      userId: req.user?.id 
    });

    res.status(200).json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });
  } catch (error: any) {
    logger.error('Delete error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el archivo'
    });
  }
};

/**
 * @desc    Obtener información de un archivo desde Supabase Storage
 * @route   GET /api/upload/lesson-media/:filename
 * @access  Private (Admin)
 */
export const getFileInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;

    if (!filename) {
      res.status(400).json({
        success: false,
        error: 'Nombre de archivo no proporcionado'
      });
      return;
    }

    const filePath = `lessons/${filename}`;

    // Obtener metadata del archivo
    const { data, error } = await supabase.storage
      .from('lesson-media')
      .list('lessons', {
        search: filename
      });

    if (error) {
      logger.error('Supabase Storage info error', { error: error.message });
      res.status(500).json({
        success: false,
        error: `Error al obtener información del archivo: ${error.message}`
      });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado'
      });
      return;
    }

    const fileData = data[0];

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('lesson-media')
      .getPublicUrl(filePath);
    
    res.status(200).json({
      success: true,
      data: {
        filename: fileData.name,
        size: fileData.metadata?.size || 0,
        createdAt: fileData.created_at,
        updatedAt: fileData.updated_at,
        url: publicUrlData.publicUrl
      }
    });
  } catch (error: any) {
    logger.error('Get file info error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Error al obtener información del archivo'
    });
  }
};
