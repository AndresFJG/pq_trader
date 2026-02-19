import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API endpoint para obtener mentores con fallback a Railway backend
export async function GET() {
  try {
    // Intentar acceso directo a tabla primero
    let mentors, error;
    
    // Intento 1: Acceso directo a tabla
    const tableResult = await supabase
      .from('mentors')
      .select('*')
      .order('id', { ascending: true });
    
    if (tableResult.error) {
      console.error('Table access failed, trying backend...', tableResult.error);
      
      // Intento 2: Llamar al backend como fallback
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pq-trader-backend-production.up.railway.app';
        const response = await fetch(`${backendUrl}/api/mentors`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            return NextResponse.json(data.data);
          }
        }
      } catch (backendError) {
        console.error('Backend also failed:', backendError);
      }
      
      return NextResponse.json(
        { success: false, error: 'Error al obtener mentores' }, 
        { status: 500 }
      );
    }
    
    mentors = tableResult.data;
    
    if (!mentors || mentors.length === 0) {
      return NextResponse.json([]);
    }

    // Mapear a la estructura esperada por el frontend
    const formattedMentors = mentors.map(mentor => {
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
        achievements: [],
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
    console.error('Exception calling backend:', err);
    return NextResponse.json(
      { success: false, error: 'Error al conectar con el backend' }, 
      { status: 500 }
    );
  }
}
