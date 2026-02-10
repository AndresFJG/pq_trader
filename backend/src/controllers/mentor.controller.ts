import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { asyncHandler } from '../utils/asyncHandler';

// Datos hardcoded como fallback si falla la consulta RPC
const FALLBACK_MENTORS = [
  {
    id: 1,
    name: 'Marco Andrés',
    phrase: 'El trading es la forma más difícil de hacer dinero fácil',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque práctico',
    description: 'Más de 5 años de trayectoria en MQL5 y 100% enfocado en el desarrollo de estrategias basadas en Price Action.',
    highlights: ['Python', 'StrategyQuant', 'Risk Management']
  },
  {
    id: 2,
    name: 'Andrés J',
    phrase: 'El trading algorítmico exige evidencia y robustez',
    title: 'Especialista en Trading Algorítmico',
    subtitle: 'Especialista en Trading Algorítmico',
    description: 'Más de cinco años de experiencia en el desarrollo de estrategias de trading algorítmico.',
    highlights: ['Trading Algorítmico', 'Análisis Cuantitativo']
  }
];

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
    console.log('⚠️ Using fallback mentor data');
    // Usar datos hardcoded si falla la RPC
    const formattedMentors = FALLBACK_MENTORS.map(mentor => ({
      id: mentor.id.toString(),
      name: mentor.name,
      email: `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
      avatar: `/mentors/${mentor.id}.jpg`,
      bio: mentor.description,
      specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
      achievements: ['Trader Profesional', 'Mentor Certificado'],
      linkedin: '',
      image: `/mentors/${mentor.id}.jpg`,
      title: mentor.title,
      subtitle: mentor.subtitle,
      students: 50,
      rating: 5.0,
      sessions: 100,
      quote: mentor.phrase
    }));
    
    res.json({
      success: true,
      count: formattedMentors.length,
      data: formattedMentors
    });
    return;
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

  if (error) {
    console.error('❌ Supabase RPC error for single mentor:', error);
    console.log('⚠️ Using fallback mentor data');
    // Buscar en datos hardcoded
    const fallbackMentor = FALLBACK_MENTORS.find(m => m.id === parseInt(id));
    
    if (!fallbackMentor) {
      res.status(404).json({
        success: false,
        error: 'Mentor no encontrado'
      });
      return;
    }
    
    const formattedMentor = {
      id: fallbackMentor.id.toString(),
      name: fallbackMentor.name,
      email: `${fallbackMentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
      avatar: `/mentors/${fallbackMentor.id}.jpg`,
      bio: fallbackMentor.description,
      specialties: Array.isArray(fallbackMentor.highlights) ? fallbackMentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
      achievements: ['Trader Profesional', 'Mentor Certificado'],
      linkedin: '',
      image: `/mentors/${fallbackMentor.id}.jpg`,
      title: fallbackMentor.title,
      subtitle: fallbackMentor.subtitle,
      students: 50,
      rating: 5.0,
      sessions: 100,
      quote: fallbackMentor.phrase
    };
    
    res.json({
      success: true,
      data: formattedMentor
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
