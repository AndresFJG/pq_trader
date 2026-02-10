import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Usar RPC function para bypass PostgREST cache
    const { data: mentors, error } = await supabase.rpc('get_all_mentors');
    
    if (error) {
      console.error('Error fetching mentors via RPC:', error);
      return NextResponse.json(
        { success: false, error: error.message }, 
        { status: 500 }
      );
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
