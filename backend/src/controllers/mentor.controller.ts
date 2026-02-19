import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * @desc    Get all mentors
 * @route   GET /api/mentors
 * @access  Public
 */
export const getMentors = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('🔍 Fetching mentors directly from table...');
  
  // Acceso directo a la tabla mentors
  const { data: mentors, error } = await supabase
    .from('mentors')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('❌ Supabase error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener mentores de la base de datos',
      details: error
    });
    return;
  }

  if (!mentors || mentors.length === 0) {
    console.log('⚠️ No mentors found in database');
    res.json({
      success: true,
      count: 0,
      data: []
    });
    return;
  }

  console.log('✅ Mentors fetched:', mentors.length);
  console.log('📊 Mentor data:', JSON.stringify(mentors, null, 2));

  // Mapear a la estructura esperada por el frontend
  const formattedMentors = mentors.map(mentor => {
    // Construir URL de imagen desde Supabase Storage
    const imageUrl = mentor.image_url 
      ? `https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/${mentor.image_url}`
      : 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg';
    
    return {
      id: mentor.id.toString(),
      name: mentor.name,
      email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
      avatar: imageUrl,
      bio: mentor.description || '',
      specialties: Array.isArray(mentor.highlights) ? mentor.highlights : [],
      achievements: mentor.achievements || [],
      linkedin: mentor.linkedin || '',
      image: imageUrl,
      title: mentor.title || mentor.name,
      subtitle: mentor.subtitle || '',
      students: mentor.students || 0,
      rating: mentor.rating || 5.0,
      sessions: mentor.sessions || 0,
      quote: mentor.phrase || ''
    };
  });

  res.json({
    success: true,
    count: formattedMentors.length,
    data: formattedMentors
  });
});

/**
 * @desc    Get single mentor by ID
 * @route   GET /api/mentors/:id
 * @access  Public
 */
export const getMentor = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Usar RPC function para bypass PostgREST cache
  const { data: mentorResult, error } = await supabase.rpc('get_mentor_by_id', { 
    mentor_id: parseInt(id) 
  });

  if (error) {
    console.error('❌ Supabase RPC error for single mentor:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener mentor de la base de datos'
    });
    return;
  }

  // RPC devuelve array, tomar el primer elemento
  const mentor = mentorResult && mentorResult.length > 0 ? mentorResult[0] : null;

  if (!mentor) {
    res.status(404).json({
      success: false,
      error: 'Mentor no encontrado'
    });
    return;
  }

  // Construir URL de imagen desde Supabase Storage
  const imageUrl = mentor.image_url 
    ? `https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/${mentor.image_url}`
    : 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg';
  
  const formattedMentor = {
    id: mentor.id.toString(),
    name: mentor.name,
    email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
    avatar: imageUrl,
    bio: mentor.description || '',
    specialties: Array.isArray(mentor.highlights) ? mentor.highlights : [],
    achievements: mentor.achievements || [],
    linkedin: mentor.linkedin || '',
    image: imageUrl,
    title: mentor.title || mentor.name,
    subtitle: mentor.subtitle || '',
    students: mentor.students || 0,
    rating: mentor.rating || 5.0,
    sessions: mentor.sessions || 0,
    quote: mentor.phrase || ''
  };

  res.json({
    success: true,
    data: formattedMentor
  });
});

/**
 * @desc    Upload mentor photo to Supabase Storage
 * @route   POST /api/mentors/upload-photo
 * @access  Protected (Admin)
 */
export const uploadMentorPhoto = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const file = req.file;
  
  if (!file) {
    res.status(400).json({
      success: false,
      error: 'No se proporcionó ninguna imagen'
    });
    return;
  }

  const mentorName = req.body.name || 'mentor';
  const ext = file.originalname.split('.').pop();
  const fileName = `${mentorName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;

  try {
    // Subir a Supabase Storage usando service role key para permisos completos
    const { data, error } = await supabase.storage
      .from('mentors')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('❌ Error uploading to Supabase Storage:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al subir la imagen'
      });
      return;
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('mentors')
      .getPublicUrl(fileName);

    console.log('✅ Imagen subida exitosamente:', publicUrlData.publicUrl);

    res.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName: fileName,
      message: 'Imagen subida exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Exception uploading mentor photo:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno al subir la imagen'
    });
  }
});
