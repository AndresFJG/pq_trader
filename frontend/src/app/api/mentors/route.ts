import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Datos hardcoded como fallback si falla la consulta
const FALLBACK_MENTORS = [
  {
    id: '1',
    name: 'Marco Andrés',
    email: 'marco.andres@pqtrader.com',
    avatar: '/mentors/1.jpg',
    bio: 'Más de 5 años de trayectoria en MQL5 y 100% enfocado en el desarrollo de estrategias basadas en Price Action.',
    specialties: ['Python', 'StrategyQuant', 'Risk Management'],
    achievements: ['Trader Profesional', 'Mentor Certificado'],
    linkedin: '',
    image: '/mentors/1.jpg',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque práctico',
    students: 50,
    rating: 5.0,
    sessions: 100,
    quote: 'El trading es la forma más difícil de hacer dinero fácil'
  },
  {
    id: '2',
    name: 'Andrés J',
    email: 'andres.j@pqtrader.com',
    avatar: '/mentors/2.jpg',
    bio: 'Más de cinco años de experiencia en el desarrollo de estrategias de trading algorítmico.',
    specialties: ['Trading Algorítmico', 'Análisis Cuantitativo'],
    achievements: ['Especialista en Trading', 'Desarrollador quantitative'],
    linkedin: '',
    image: '/mentors/2.jpg',
    title: 'Especialista en Trading Algorítmico',
    subtitle: 'Especialista en Trading Algorítmico',
    students: 45,
    rating: 5.0,
    sessions: 95,
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

    return NextResponse.json(formattedMentors);
  } catch (err: any) {
    console.error('Exception in mentors API:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
