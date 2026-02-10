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
  console.log('🔍 Refreshing schema cache and fetching mentors...');
  
  // Intentar refrescar el cache de PostgREST primero
  try {
    await supabase.rpc('notify_pgrst_reload');
  } catch (e) {
    console.log('⚠️ notify_pgrst_reload not available, continuing...');
  }
  
  // Intentar usar la función creada
  const { data: mentors, error } = await supabase.rpc('get_all_mentors');

  if (error) {
    console.error('❌ Supabase error:', error);
    throw error;
  }

  console.log('✅ Mentors fetched:', mentors?.length || 0);
  console.log('📊 Mentor data:', JSON.stringify(mentors, null, 2));

  // Mapear a la estructura esperada por el frontend
  const formattedMentors = (mentors || []).map(mentor => ({
    id: mentor.id.toString(),
    name: mentor.name,
    email: `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
    avatar: `/mentors/${mentor.id}.jpg`,
    bio: mentor.description || 'Mentor especializado en trading algorítmico.',
    specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
    achievements: ['Trader Profesional', 'Mentor Certificado'],
    linkedin: '',
    // Campos adicionales para compatibilidad con la UI de mentorias
    image: `/mentors/${mentor.id}.jpg`,
    title: mentor.title || mentor.name,
    subtitle: mentor.subtitle || 'Experto en Trading Algorítmico',
    students: 50,
    rating: 5.0,
    sessions: 100,
    quote: mentor.phrase || 'Transformando traders en profesionales exitosos.'
  }));

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

  if (error) throw error;

  // RPC devuelve array, tomar el primer elemento
  const mentor = mentorResult && mentorResult.length > 0 ? mentorResult[0] : null;

  if (!mentor) {
    res.status(404).json({
      success: false,
      error: 'Mentor no encontrado'
    });
    return;
  }

  // Formatear con estructura completa
  const formattedMentor = {
    id: mentor.id.toString(),
    name: mentor.name,
    email: `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
    avatar: `/mentors/${mentor.id}.jpg`,
    bio: mentor.description || 'Mentor especializado en trading algorítmico.',
    specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
    achievements: ['Trader Profesional', 'Mentor Certificado'],
    linkedin: '',
    image: `/mentors/${mentor.id}.jpg`,
    title: mentor.title || mentor.name,
    subtitle: mentor.subtitle || 'Experto en Trading Algorítmico',
    students: 50,
    rating: 5.0,
    sessions: 100,
    quote: mentor.phrase || 'Transformando traders en profesionales exitosos.'
  };

  res.json({
    success: true,
    data: formattedMentor
  });
});
