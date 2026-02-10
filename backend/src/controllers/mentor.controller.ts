import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';
import { asyncHandler } from '../utils/asyncHandler';

// Datos hardcoded como fallback si falla la consulta RPC
// URLs de Supabase Storage
const FALLBACK_MENTORS = [
  {
    id: 1,
    name: 'Marco Andrés',
    phrase: 'El trading es la forma más difícil de hacer dinero fácil',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque práctico',
    description: 'Más de 5 años de trayectoria en MQL5 y 100% de éxito en Upwork. Profesor de Trading Algorítmico y experto en el desarrollo de Expert Advisors (EAs) para la plataforma MT4. Ha validado sistemas con esperanza matemática positiva en tiempo real y cuenta con certificaciones oficiales en pruebas de fondeo. Tutor de traders Top 1 en Darwinex Zero.',
    highlights: ['Localizador de ventajas estadísticas', 'Métodos personalizados de optimización', 'Estrategias de volatilidad extrema', 'MQL5, fxDremma, EAbuilder'],
    image: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg'
  },
  {
    id: 2,
    name: 'Jeremias',
    phrase: 'El trading algorítmico exige evidencia y robustez',
    title: 'Especialista en Trading Algorítmico',
    subtitle: '5+ años en desarrollo y optimización de estrategias',
    description: 'Más de cinco años de experiencia en el desarrollo, optimización y automatización de sistemas de trading algorítmico. Trabajo orientado a la construcción de estrategias sistemáticas sostenibles en el tiempo. Formado en el Programa Quant de UCEMA y con una Diplomatura en Asesoramiento Financiero (Universidad Blas Pascal), combina fundamentos académicos con experiencia operativa. Cuenta con experiencia en Darwinex y Darwinex Zero, incluyendo diseño de estrategias adaptadas al motor de riesgo de la plataforma y acompañamiento técnico en cuentas de fondeo y acceso a capital.',
    highlights: ['Backtesting y optimización (WFA)', 'Tests de robustez (Montecarlo)', 'Portafolios algorítmicos'],
    image: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Jeremias.jpeg'
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
    const formattedMentors = FALLBACK_MENTORS.map(mentor => {
      // Achievements específicos por mentor
      const achievements = mentor.id === 1 
        ? ['5 años de clientes satisfechos en MQL5', '4 años como profesor de trading algorítmico', '100% de clientes satisfechos en Upwork', 'Tutor de traders top 1 en Darwinex Zero', '+ de 2000 estrategias creadas desde 2021']
        : ['Programa Quant UCEMA', 'Diplomatura Asesoramiento Financiero', 'Experiencia Darwinex & Darwinex Zero'];
      
      return {
        id: mentor.id.toString(),
        name: mentor.name,
        email: mentor.id === 1 ? 'marco.andres@pqtrader.com' : 'jeremias@pqtrader.com',
        avatar: mentor.image,
        bio: mentor.description,
        specialties: Array.isArray(mentor.highlights) ? mentor.highlights : [],
        achievements: achievements,
        linkedin: mentor.id === 1 ? 'https://www.mql5.com/es/users/marcotisma/news' : '',
        image: mentor.image,
        title: mentor.title,
        subtitle: mentor.subtitle,
        students: mentor.id === 1 ? 50 : 150,
        rating: 4.9,
        sessions: mentor.id === 1 ? 100 : 200,
        quote: mentor.phrase
      };
    });
    
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
  const formattedMentors = (mentors || []).map(mentor => {
    // Buscar fallback para obtener URL de imagen
    const fallback = FALLBACK_MENTORS.find(f => f.id === mentor.id);
    const imageUrl = fallback?.image || 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg';
    
    // Achievements específicos por mentor
    const achievements = mentor.id === 1 
      ? ['5 años de clientes satisfechos en MQL5', '4 años como profesor de trading algorítmico', '100% de clientes satisfechos en Upwork', 'Tutor de traders top 1 en Darwinex Zero', '+ de 2000 estrategias creadas desde 2021']
      : ['Programa Quant UCEMA', 'Diplomatura Asesoramiento Financiero', 'Experiencia Darwinex & Darwinex Zero'];
    
    return {
      id: mentor.id.toString(),
      name: mentor.name,
      email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
      avatar: imageUrl,
      bio: mentor.description || 'Mentor especializado en trading algorítmico.',
      specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
      achievements: achievements,
      linkedin: mentor.linkedin || '',
      // Campos adicionales para compatibilidad con la UI de mentorias
      image: imageUrl,
      title: mentor.title || mentor.name,
      subtitle: mentor.subtitle || 'Experto en Trading Algorítmico',
      students: mentor.students || 50,
      rating: mentor.rating || 5.0,
      sessions: mentor.sessions || 100,
      quote: mentor.phrase || 'Transformando traders en profesionales exitosos.'
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
    
    // Achievements específicos por mentor
    const achievements = fallbackMentor.id === 1 
      ? ['5 años de clientes satisfechos en MQL5', '4 años como profesor de trading algorítmico', '100% de clientes satisfechos en Upwork', 'Tutor de traders top 1 en Darwinex Zero', '+ de 2000 estrategias creadas desde 2021']
      : ['Programa Quant UCEMA', 'Diplomatura Asesoramiento Financiero', 'Experiencia Darwinex & Darwinex Zero'];
    
    const formattedMentor = {
      id: fallbackMentor.id.toString(),
      name: fallbackMentor.name,
      email: fallbackMentor.id === 1 ? 'marco.andres@pqtrader.com' : 'jeremias@pqtrader.com',
      avatar: fallbackMentor.image,
      bio: fallbackMentor.description,
      specialties: Array.isArray(fallbackMentor.highlights) ? fallbackMentor.highlights : [],
      achievements: achievements,
      linkedin: fallbackMentor.id === 1 ? 'https://www.mql5.com/es/users/marcotisma/news' : '',
      image: fallbackMentor.image,
      title: fallbackMentor.title,
      subtitle: fallbackMentor.subtitle,
      students: fallbackMentor.id === 1 ? 50 : 150,
      rating: 4.9,
      sessions: fallbackMentor.id === 1 ? 100 : 200,
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
  const fallback = FALLBACK_MENTORS.find(f => f.id === mentor.id);
  const imageUrl = fallback?.image || 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg';
  
  // Achievements específicos por mentor
  const achievements = mentor.id === 1 
    ? ['5 años de clientes satisfechos en MQL5', '4 años como profesor de trading algorítmico', '100% de clientes satisfechos en Upwork', 'Tutor de traders top 1 en Darwinex Zero', '+ de 2000 estrategias creadas desde 2021']
    : ['Programa Quant UCEMA', 'Diplomatura Asesoramiento Financiero', 'Experiencia Darwinex & Darwinex Zero'];
  
  const formattedMentor = {
    id: mentor.id.toString(),
    name: mentor.name,
    email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
    avatar: imageUrl,
    bio: mentor.description || 'Mentor especializado en trading algorítmico.',
    specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
    achievements: achievements,
    linkedin: mentor.linkedin || '',
    image: imageUrl,
    title: mentor.title || mentor.name,
    subtitle: mentor.subtitle || 'Experto en Trading Algorítmico',
    students: mentor.students || 50,
    rating: mentor.rating || 5.0,
    sessions: mentor.sessions || 100,
    quote: mentor.phrase || 'Transformando traders en profesionales exitosos.'
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
