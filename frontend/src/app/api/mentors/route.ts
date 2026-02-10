import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Datos hardcoded como fallback si falla la consulta
const FALLBACK_MENTORS = [
  {
    id: '1',
    name: 'Marco Andrés',
    email: 'marco.andres@pqtrader.com',
    avatar: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg',
    bio: 'Más de 5 años de trayectoria en MQL5 y 100% de éxito en Upwork. Profesor de Trading Algorítmico y experto en el desarrollo de Expert Advisors (EAs) para la plataforma MT4. Ha validado sistemas con esperanza matemática positiva en tiempo real y cuenta con certificaciones oficiales en pruebas de fondeo. Tutor de traders Top 1 en Darwinex Zero.',
    specialties: ['Localizador de ventajas estadísticas', 'Métodos personalizados de optimización', 'Estrategias de volatilidad extrema', 'MQL5, fxDremma, EAbuilder'],
    achievements: ['5 años de clientes satisfechos en MQL5', '4 años como profesor de trading algorítmico', '100% de clientes satisfechos en Upwork', 'Tutor de traders top 1 en Darwinex Zero', '+ de 2000 estrategias creadas desde 2021'],
    linkedin: 'https://www.mql5.com/es/users/marcotisma/news',
    image: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque práctico',
    students: 50,
    rating: 4.9,
    sessions: 100,
    quote: 'El trading es la forma más difícil de hacer dinero fácil'
  },
  {
    id: '2',
    name: 'Jeremias',
    email: 'jeremias@pqtrader.com',
    avatar: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Jeremias.jpeg',
    bio: 'Más de cinco años de experiencia en el desarrollo, optimización y automatización de sistemas de trading algorítmico. Trabajo orientado a la construcción de estrategias sistemáticas sostenibles en el tiempo. Formado en el Programa Quant de UCEMA y con una Diplomatura en Asesoramiento Financiero (Universidad Blas Pascal), combina fundamentos académicos con experiencia operativa. Cuenta con experiencia en Darwinex y Darwinex Zero, incluyendo diseño de estrategias adaptadas al motor de riesgo de la plataforma y acompañamiento técnico en cuentas de fondeo y acceso a capital.',
    specialties: ['Backtesting y optimización (WFA)', 'Tests de robustez (Montecarlo)', 'Portafolios algorítmicos'],
    achievements: ['Programa Quant UCEMA', 'Diplomatura Asesoramiento Financiero', 'Experiencia Darwinex & Darwinex Zero'],
    linkedin: '',
    image: 'https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Jeremias.jpeg',
    title: 'Especialista en Trading Algorítmico',
    subtitle: '5+ años en desarrollo y optimización de estrategias',
    students: 150,
    rating: 4.9,
    sessions: 200,
    quote: 'El trading algorítmico exige evidencia y robustez'
  }
];

export async function GET() {
  try {
    // Usar RPC function para bypass PostgREST cache
    const { data: mentors, error } = await supabase.rpc('get_all_mentors');
    
    if (error) {
      console.error('Error fetching mentors via RPC:', error);
      // Si falla RPC, devolver datos hardcoded
      console.log('⚠️ Using fallback mentor data');
      return NextResponse.json(FALLBACK_MENTORS);
    }

    // Mapear a la estructura esperada por el frontend
    const formattedMentors = (mentors || []).map(mentor => {
      // Buscar el fallback correspondiente para obtener la URL de Supabase
      const fallback = FALLBACK_MENTORS.find(f => f.id === mentor.id.toString());
      const imageUrl = fallback?.image || `https://twbppbgvcvcxktloulyp.supabase.co/storage/v1/object/public/mentors/Martin.jpg`;
      
      return {
        id: mentor.id.toString(),
        name: mentor.name,
        email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@pqtrader.com`,
        avatar: imageUrl,
        bio: mentor.description || 'Mentor especializado en trading algorítmico.',
        specialties: Array.isArray(mentor.highlights) ? mentor.highlights : ['Python', 'StrategyQuant', 'Risk Management'],
        achievements: fallback?.achievements || ['Trader Profesional', 'Mentor Certificado'],
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

    return NextResponse.json(formattedMentors);
  } catch (err: any) {
    console.error('Exception in mentors API:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
