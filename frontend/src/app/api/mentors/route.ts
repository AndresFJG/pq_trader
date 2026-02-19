import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Acceso directo a la tabla mentors
    const { data: mentors, error } = await supabase
      .from('mentors')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching mentors from table:', error);
      return NextResponse.json(
        { success: false, error: 'Error al obtener mentores de la base de datos' }, 
        { status: 500 }
      );
    }

    if (!mentors || mentors.length === 0) {
      return NextResponse.json([]);
    }

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

    return NextResponse.json(formattedMentors);
  } catch (err: unknown) {
    console.error('Exception in mentors API:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
